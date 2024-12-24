const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = require("express")();
const server = createServer(app);

app.get("/", (req, res) => {
    res.send("Con me may")
})

server.listen(8082, () => console.log("Listening on port 8082"));