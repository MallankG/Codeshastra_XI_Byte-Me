// Replace your CORS configuration in server.js
const express = require("express");
const http = require("http");
const next = require("next");
const path = require("path");
const cors = require("cors");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  
  // Configure CORS middleware for Express
  expressApp.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"]
  }));
  
  const server = http.createServer(expressApp);
  
  // Configure Socket.IO with CORS
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['polling', 'websocket']
  });
  
  // Socket.IO event handlers
  io.on("connection", (socket) => {
    console.log("New user connected");
    
    socket.on("new-user", (name) => {
      socket.data.username = name;
      socket.broadcast.emit("user-connected", name);
    });
    
    socket.on("send-chat-message", (message) => {
      const username = socket.data.username || "Anonymous";
      socket.broadcast.emit("chat-message", { name: username, message });
    });
    
    socket.on("disconnect", () => {
      const username = socket.data.username;
      if (username) {
        socket.broadcast.emit("user-disconnected", username);
      }
    });
  });
  
  // Handle all other routes with Next.js
  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });
  
  const PORT = process.env.PORT || 3500;
  server.listen(PORT, () => {
    console.log(`> Server ready on http://localhost:${PORT}`);
  });
});