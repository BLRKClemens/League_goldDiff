import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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

let state = { name: "hello World!", counter: 0 };

io.on("connection", (socket) => {
  console.log("✅ Neue Verbindung:", socket.id);
  socket.emit("updateState", state);

  socket.on("disconnect", () => {
    console.log("❌ Verbindung getrennt:", socket.id);
  });

  socket.on("updateState", (newState) => {
    state = newState;
    console.log("updatedState", state);
    socket.broadcast.emit("updateState", state);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
