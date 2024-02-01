const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();
const io = new Server({
  cors: true,
});

app.use(bodyParser.json());

const emailToSocket = new Map();
const socketToEmail = new Map();

io.on("connection", (socket) => {
  console.log("New Connection");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log(`User ${emailId} joined room ${roomId}`);
    emailToSocket.set(emailId, socket.id);
    socketToEmail.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;

    if (emailId && offer) {
      const socketId = emailToSocket.get(emailId);
      const fromEmail = socketToEmail.get(socket.id);
      socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
    }
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocket.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans });
  });
});

app.listen("3000", () => {
  console.log("Server running on port 3000");
});
io.listen("3001");
