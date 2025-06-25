import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import tmi from "tmi.js";
import { faker } from "@faker-js/faker";
import fs from "fs";

// Hilfsfunktionen um __dirname in ESM zu simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Statischer Ordner für HTML-Dateien
app.use(express.static(join(__dirname, "dist")));
const startTime = 3;
const team = {
  rot: "rot",
  blau: "blau",
};

let alreadyVoted = [];

let state = {
  leadingTeam: "rot",
  goldDiffGoal: 0,
  polling: false,
  pollingTime: startTime,
  leaderBoard: [],
};

function updateState() {
  io.sockets.emit("updateState", state);
}

async function writeToFile(leaderBoard) {
  const logsFolderName = "logs";
  const logsFolderPath = join(__dirname, logsFolderName);

  const pad = (string) => (String(string).length == 1 ? `0${string}` : string);
  const now = new Date();
  const folderName = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  console.log("folderName", folderName);
  const folderPath = join(logsFolderPath, folderName);

  const fileName = `${now.getHours()}-${pad(now.getMinutes())}-${pad(
    now.getSeconds()
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

  let timerId;
  socket.on("startPolling", (goldDiffGoal) => {
    if (state.polling) return;
    clearInterval(timerId);
    state.goldDiffGoal = goldDiffGoal;
    state.polling = true;
    state.pollingTime = startTime;
    state.leaderBoard = [];
    alreadyVoted = [];

    timerId = setInterval(() => {
      state.pollingTime--;
      if (state.pollingTime <= 0) {
        clearInterval(timerId);
        state.polling = false;
        writeToFile(state.leaderBoard);
      }
      updateState();
    }, 1000);

    updateState();
  });

  socket.on("selectLeadingTeam", (leadingTeam) => {
    console.log("leadingTeam", leadingTeam);
    state.leadingTeam = leadingTeam;
    updateState();
  });
});
const client = new tmi.Client({
  channels: ["clemens_blrk_test"],
});

client.connect();
const commandFormat = /^!dkb (\w+) (\d+)$/i;

function sendRandomTestCommands() {
  setInterval(() => {
    const randomTeam = Math.random() > 0.5 ? "Rot" : "Blau";
    const randomGoldDiff = Math.floor(Math.random() * 10000);

    onTwitchMessage(
      "",
      faker.person.lastName(),
      `!dkb ${randomTeam} ${randomGoldDiff}`
    );
  }, 1);
}

//sendTestCommands();
sendRandomTestCommands();

function onTwitchMessage(channel, name, message) {
  if (!state?.polling) return;
  if (alreadyVoted.includes(name)) return;
  const match = message.match(commandFormat);

  if (!match) return;
  const leadingTeam = match[1].toLowerCase();
  const goldDiff = parseInt(match[2].toLowerCase());

  if (leadingTeam != team.rot && leadingTeam != team.blau) return;

  const diffToGoal =
    leadingTeam === state.leadingTeam
      ? Math.abs(state.goldDiffGoal - goldDiff)
      : state.goldDiffGoal + goldDiff;

  state.leaderBoard.push({
    channel,
    name,
    leadingTeam,
    goldDiff,
    diffToGoal,
  });

  state.leaderBoard.sort((a, b) => a.diffToGoal - b.diffToGoal);
  state.leaderBoard = state.leaderBoard.slice(0, 5);

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
