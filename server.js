import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import tmi from "tmi.js";
import { faker } from "@faker-js/faker";
import fs from "fs";
import { team } from "./src/shared/types.js";

// Hilfsfunktionen um __dirname in ESM zu simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

// Statischer Ordner für HTML-Dateien
app.use(express.static(join(__dirname, "dist")));
const startTime = 30;

let alreadyVoted = [];
let state;
let timerId;

function initState() {
  clearInterval(timerId);
  state = {
    leadingTeam: "wichtiger",
    pointGoal: "",
    polling: false,
    pollingTime: startTime,
    leaderBoard: [],
    captainGuesses: {
      [team.red]: "",
      [team.blue]: "",
    },
    score: [0, 0],
    scoreMaximum: 3000,
    visible: {
      solution: false,
      table: false,
    },
    guesses: {},
    isPointsVisible: false,
  };
}

initState();

function updateState() {
  io.sockets.emit("updateState", state);
}

async function writeToFile(leaderBoard) {
  const logsFolderName = "logs";
  const logsFolderPath = join(__dirname, logsFolderName);

  const pad = (string) => (String(string).length == 1 ? `0${string}` : string);
  const now = new Date();
  const folderName = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}`;
  console.log("folderName", folderName);
  const folderPath = join(logsFolderPath, folderName);

  const fileName = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
    now.getSeconds(),
  )}.json`;
  console.log("fileName", fileName);
  const filePath = join(folderPath, fileName);

  if (!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath);
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  fs.writeFileSync(filePath, JSON.stringify(leaderBoard, null, 2));

  console.log("file written to", filePath);
}

io.on("connection", (socket) => {
  console.log("✅ Neue Verbindung:", socket.id);
  socket.emit("updateState", state);

  socket.on("disconnect", () => {
    console.log("❌ Verbindung getrennt:", socket.id);
  });

  socket.on("startPolling", (pointGoal) => {
    if (state.polling) return;
    clearInterval(timerId);
    state.pointGoal = pointGoal;
    state.polling = true;
    state.pollingTime = startTime;
    state.leaderBoard = [];
    alreadyVoted = [];

    timerId = setInterval(() => {
      state.pollingTime--;
      if (state.pollingTime <= 0) {
        clearInterval(timerId);
        state.polling = false;
        writeToFile(state.guesses);
      }
      updateState();
    }, 1000);

    updateState();
  });

  socket.on("sortGuesses", (pointGoal) => {
    if (state.polling) return;
    state.leaderBoard = [];
    state.pointGoal = pointGoal;

    for (const [name, guess] of Object.entries(state.guesses)) {
      if (guess.team != state.leadingTeam) {
        continue;
      }
      const diffToGoal = Math.abs(state.pointGoal - guess.pointDiff);
      state.leaderBoard.push({
        name,
        ...guess,
        difference: diffToGoal,
      });
    }
    state.leaderBoard.sort(
      (a, b) => a.difference - b.difference || a.timeStamp - b.timeStamp,
    );
    state.leaderBoard = state.leaderBoard.slice(0, 5);
    updateState();
  });

  socket.on("selectLeadingTeam", (leadingTeam) => {
    console.log("leadingTeam", leadingTeam);
    state.leadingTeam = leadingTeam;
    updateState();
  });

  socket.on("updateGuessTeamCaptain", (team, guess) => {
    state.captainGuesses[team] = parseInt(guess);
    updateState();
  });

  Object.entries(state.visible).forEach(([graphic, _]) => {
    socket.on(`toggle${graphic}`, (isVisible) => {
      state.visible[graphic] = isVisible;
      updateState();
    });
  });

  socket.on("reset", () => {
    console.log("reset");
    initState();
    updateState();
  });

  socket.on("updateScore", (score, index) => {
    state.score[index] += score;

    updateState();
  });

  socket.on("updateScoreMaximum", (score) => {
    state.scoreMaximum = score;
    updateState();
  });

  socket.on("toggleIsPointsVisible", (isVisible) => {
    state.isPointsVisible = !state.isPointsVisible;
    updateState();
  });
});
const client = new tmi.Client({
  channels: ["clemens_blrk_test", "tolkin", "karni", "nnoprime", "noway4u_sir"],
});

client.connect();
const commandFormat = /^!(wichtiger|nooreax) (\d+)$/i;

function sendRandomTestCommands() {
  setInterval(() => {
    const randomTeam = Math.random() > 0.5 ? "wichtiger" : "nooreax";
    const randomPointDiff = Math.floor(Math.random() * 300);

    onTwitchMessage(
      "",
      faker.internet.username(),
      `!${randomTeam} ${randomPointDiff}`,
    );
  }, 1);
}

// sendRandomTestCommands();

const bannedUsers = [];

function onTwitchMessage(channel, name, message) {
  const timeStamp = Date.now();
  if (!state?.polling) return;
  if (alreadyVoted.includes(name)) return;
  if (bannedUsers.includes(name)) return;
  const match = message.match(commandFormat);

  if (!match) return;
  const leadingTeam = match[1].toLowerCase();
  const pointDiff = parseInt(match[2].toLowerCase());

  // if (leadingTeam != state.leadingTeam) return;

  const diffToGoal = Math.abs(state.pointGoal - pointDiff);

  // state.leaderBoard.push({
  //   channel,
  //   name,
  guess: (pointDiff,
    //   difference: diffToGoal,
    // });

    // state.leaderBoard.sort((a, b) => a.difference - b.difference);
    // state.leaderBoard = state.leaderBoard.slice(0, 5);

    (state.guesses[name] = {
      channel,
      team: leadingTeam,
      pointDiff,
      timeStamp,
    }));
  alreadyVoted.push(name);
  io.sockets.emit("updateState", state);
}

client.on("message", (channel, tags, message, self) => {
  onTwitchMessage(channel, tags["display-name"], message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

global.onTwitchMessage = onTwitchMessage;
