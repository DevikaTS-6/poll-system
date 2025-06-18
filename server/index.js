const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins during dev
    methods: ["GET", "POST"]
  }
});

let currentQuestion = null;
let answers = [];
let students = new Map(); // socket.id -> name

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("student-join", (name) => {
    students.set(socket.id, name);
    console.log("Students connected:", Array.from(students.values()));
  });

  socket.on("new-question", (question) => {
    currentQuestion = question;
    answers = [];
    io.emit("question", question);
  });

  socket.on("submit-answer", (answer) => {
    const name = students.get(socket.id);
    if (!answers.find(a => a.name === name)) {
      answers.push({ name, answer });
    }
    io.emit("update-results", answers);

    if (answers.length >= students.size) {
      io.emit("poll-ended", answers);
      currentQuestion = null;
    }
  });

  socket.on("disconnect", () => {
    students.delete(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("✅ Server is running on http://localhost:5000");
});
