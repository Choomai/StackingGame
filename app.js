const { createServer } = require("node:http");
const { join } = require("node:path");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
app.use("/client", express.static("client"));
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
})
app.get("/game", (req, res) => {
    if (!req.query.id) return res.status(400).send("Room ID is required!");
    res.sendFile(join(__dirname, "game.html"));
})

const pieces = [
    { name: "general", color: "red" },
    { name: "advisor", color: "red" },
    { name: "advisor", color: "red" },
    { name: "elephant", color: "red" },
    { name: "elephant", color: "red" },
    { name: "horse", color: "red" },
    { name: "horse", color: "red" },
    { name: "chariot", color: "red" },
    { name: "chariot", color: "red" },
    { name: "cannon", color: "red" },
    { name: "cannon", color: "red" },
    { name: "solider", color: "red" },
    { name: "solider", color: "red" },
    { name: "solider", color: "red" },
    { name: "solider", color: "red" },
    { name: "solider", color: "red" },
    { name: "general", color: "black" },
    { name: "advisor", color: "black" },
    { name: "advisor", color: "black" },
    { name: "elephant", color: "black" },
    { name: "elephant", color: "black" },
    { name: "horse", color: "black" },
    { name: "horse", color: "black" },
    { name: "chariot", color: "black" },
    { name: "chariot", color: "black" },
    { name: "cannon", color: "black" },
    { name: "cannon", color: "black" },
    { name: "solider", color: "black" },
    { name: "solider", color: "black" },
    { name: "solider", color: "black" },
    { name: "solider", color: "black" },
    { name: "solider", color: "black" }
]

const rooms = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

io.on("connection", socket => {
    console.log(`${socket.id} connected!`);
    
    socket.on("get_pieces", () => {
        io.to(options.room)
        console.log("get_pieces", options);
        
        socket.emit("new_piece", { name: "general", color: "black" });
    });
    socket.on("new_piece", piece => {
        console.log("found", piece);
        io.emit("new_piece", piece);
    });

    socket.on("new_room", () => {
        const roomId = Math.floor(Math.random() * 999999) + 1;
        rooms.push({
            id: roomId,
            timestamp: Date.now(),
            players: [socket.id],
            pieces: null
        });
        socket.join(roomId);
    });

    socket.on("join_room", roomId => {
        roomId = parseInt(roomId);
        if (isNaN(roomId) || roomId < 0 || roomId > 999999) {
            socket.emit("error", "Room number must be between 0 and 999999");
            return;
        };
        const room = rooms.find(room => room.id === roomId);
        if (!room) {
            socket.emit("error", "Room not found!");
            return;
        };

        room.players.push(socket.id);
        socket.join(roomId);
    });
})

io.on("disconnect", () => {
    console.log("user disconnected!");
});

server.listen(8082, () => console.log("Listening on port 8082"));