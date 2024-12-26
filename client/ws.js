const socket = io("ws://localhost:8082");
const username = sessionStorage.getItem("username") || prompt("Enter your username") || "Anonymous";
const uuid = sessionStorage.getItem("uuid") || crypto.randomUUID();
sessionStorage.setItem("username", username);
sessionStorage.setItem("uuid", uuid);
socket.emit("options", { 
    username,
    session_id: uuid
});