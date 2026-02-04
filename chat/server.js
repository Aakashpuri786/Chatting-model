const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;

// Parse JSON
app.use(express.json());
app.use(express.static("public"));

// ---------- User Management ----------
const DATA_FILE = path.join(__dirname, "data/users.json");

// Load users or create empty
let users = [];
if (fs.existsSync(DATA_FILE)) {
  users = JSON.parse(fs.readFileSync(DATA_FILE));
} else {
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users));
}

// Save users
function saveUsers() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users));
}

// Register user
app.post("/register", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send({ error: "Username required" });

  if (users.find(u => u.username === username)) {
    return res.status(400).send({ error: "Username exists" });
  }

  const newUser = { username, id: Date.now().toString() };
  users.push(newUser);
  saveUsers();
  res.send(newUser);
});

// Login
app.post("/login", (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).send({ error: "User not found" });
  res.send(user);
});

// Get all users (for contacts list)
app.get("/users", (req, res) => {
  res.send(users);
});

// ---------- Real-time Chat ----------

// In-memory chat messages
// Structure: { fromId, toId, text, timestamp }
let messages = [];

// Socket.IO real-time chat
io.on("connection", (socket) => {
  console.log("User connected via Socket:", socket.id);

  // Each user will join a "room" with their userId
  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    console.log(`User ${userId} joined their room`);

    // Send all messages where this user is sender or receiver
    const userMessages = messages.filter(
      m => m.fromId === userId || m.toId === userId
    );
    socket.emit("chat history", userMessages);
  });

  // Listen for new messages
  socket.on("chat message", (msg) => {
    // msg = { fromId, toId, text }
    msg.timestamp = Date.now();
    messages.push(msg);

    // Send message to receiver's room
    io.to(msg.toId).emit("chat message", msg);

    // Also send back to sender (so both see message)
    io.to(msg.fromId).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
