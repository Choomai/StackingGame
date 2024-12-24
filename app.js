const { createServer } = require("node:http");
const { join } = require("node:path");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
app.use(express.static("client"));
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
})

io.on("connection", socket => {
    console.log("user connected!");
    socket.on("new_piece", piece => {
        console.log("found", piece);
        io.emit("new_piece", `user ${socket.id} found piece ${piece}`);
    })
})

io.on("disconnect")

server.listen(8082, () => console.log("Listening on port 8082"));