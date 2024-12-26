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
    const roomId = parseInt(req.query.id);

    if (!isNaN(roomId) || roomId < 0 || roomId > 999999) return res.status(400).send("Invalid room ID!");
    if (!rooms.find(room => room.id === roomId)) return res.status(404).send("Room not found!");
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
const players = {}; // { room_id: socket_id }

function getPlayerUUID(socketId) {
    return Object.keys(players).find(key => players[key] === socketId)
};
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

io.on("connection", socket => {
    socket.on("options", options => {
        const { session_id: sessionId, username } = options;
        if (sessionId && username) players[sessionId] = socket.id;
        console.log(`${socket.id} connected, UUID ${sessionId}!`);
    });
    
    // socket.on("get_pieces", () => {
    //     socket.emit("new_piece", { name: "general", color: "black" });
    // });

    // socket.on("new_piece", piece => {
    //     console.log("found", piece);
    //     io.emit("new_piece", piece);
    // });

    socket.on("new_room", () => {
        const roomId = Math.floor(Math.random() * 999999) + 1;
        rooms.push({
            id: roomId,
            timestamp: Date.now(),
            players: new Set(),
            pieces: null
        });
        socket.join(roomId);
        socket.emit("room_created", roomId);
    });

    socket.on("join_room", roomId => {
        roomId = parseInt(roomId);
        const room = rooms.find(room => room.id === roomId);
        room.players.add(getPlayerUUID(socket.id));
        socket.join(roomId);
        io.to(roomId).emit("players", Array.from(room.players));
        console.log(`${getPlayerUUID(socket.id)} joined room ${roomId}`);
    });

    socket.on("chat", message => {
        message.room = parseInt(message.room);
        if (message.type == "global") {
            io.emit("chat", { type: "global", content: message.content });
        } else if (message.type == "room") {
            io.to(parseInt(message.room)).emit("chat", { type: "room", content: message.content });
        }
        console.log("Chat message:", message);
    })
})

io.on("disconnect", () => {
    console.log(`${socket.id} disconnected, UUID ${getPlayerUUID(socket.id)}!`);
});

server.listen(8082, () => console.log("Listening on port 8082"));