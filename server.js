import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import tmi from "tmi.js";
import { faker } from "@faker-js/faker";

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

let state = {
  leadingTeam: "red",
  goldDiffGoal: 0,
  polling: false,
  pollingTime: startTime,
  leaderBoard: [
    /* {
      channel: "",
      name: "Runolfsson",
      leadingTeam: "rot",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Hettinger",
      leadingTeam: "rot",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "O'Keefe",
      leadingTeam: "blau",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Kshlerin",
      leadingTeam: "blau",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Hilll",
      leadingTeam: "rot",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Marvin-Brekke",
      leadingTeam: "blau",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Haley",
      leadingTeam: "rot",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Boehm",
      leadingTeam: "rot",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Huel",
      leadingTeam: "rot",
      goldDiff: 9,
      diffToGoal: 9,
    },
    {
      channel: "",
      name: "Hirthe",
      leadingTeam: "rot",
      goldDiff: 10,
      diffToGoal: 10,
    }, */
  ],
};

function updateState() {
  io.sockets.emit("updateState", state);
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

    timerId = setInterval(() => {
      state.pollingTime--;
      if (state.pollingTime <= 0) {
        clearInterval(timerId);
        state.polling = false;
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
  channels: ["montanablack88"],
});

client.connect();
const commandFormat = /^!dkb (\w+) (\d+)$/i;

function sendTestCommands() {
  setInterval(() => {
    const randomTeam = Math.random() > 0.5 ? "Rot" : "Blau";
    const randomGoldDiff = Math.floor(Math.random() * 10000);

    onTwitchMessage(
      "",
      faker.person.lastName(),
      `!dkb ${randomTeam} ${randomGoldDiff}`
    );
  }, 100);
}

sendTestCommands();

function onTwitchMessage(channel, name, message) {
  if (!state?.polling) return;
  const match = message.match(commandFormat);

  if (!match) return;
  const leadingTeam = match[1].toLowerCase();
  const goldDiff = parseInt(match[2].toLowerCase());
  const diffToGoal = Math.abs(state.goldDiffGoal - goldDiff);

  state.leaderBoard.push({
    channel,
    name,
    leadingTeam,
    goldDiff,
    diffToGoal,
  });

  state.leaderBoard.sort((a, b) => a.diffToGoal - b.diffToGoal);
  state.leaderBoard = state.leaderBoard.slice(0, 10);
  io.sockets.emit("updateState", state);
}

client.on("message", (channel, tags, message, self) => {
  onTwitchMessage(channel, tags["display-name"], message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
