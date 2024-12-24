const socket = io();
const ul = document.querySelector("ul");

function attackHim() {
    socket.emit("new_piece", "lol");
}

socket.on("new_piece", piece => {
    const li = document.createElement("li");
    li.innerText = piece
    ul.appendChild(li)
})