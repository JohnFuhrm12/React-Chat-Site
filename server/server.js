const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const cors = require('cors');

// Initialize Port or run on 8000
const PORT = process.env.PORT || 8000;
const router = require('./router');

// Socket.io setup
io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on("send message", body => {
        io.emit("message", body)
    })
})

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log("server is running on port 8000"));