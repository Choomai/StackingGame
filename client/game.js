const roomId = new URLSearchParams(window.location.search).get("id");
const chessmap = {
    "red": {
        "general": "帅",
        "advisor": "仕",
        "elephant": "相",
        "horse": "马",
        "chariot": "车",
        "cannon": "炮",
        "soldier": "兵"
    },
    "black": {
        "general": "将",
        "advisor": "士",
        "elephant": "象",
        "horse": "马",
        "chariot": "车",
        "cannon": "炮",
        "soldier": "卒"
    }
};

socket.emit("join_room", roomId);
socket.on("players", players => {
    const playerList = document.querySelector("ul.players-list");
    playerList.innerHTML = "";
    players.forEach(player => {
        const li = document.createElement("li");
        li.innerText = player;
        playerList.appendChild(li);
    });
})




function newPiece(piece, color) {
    const chessPiece = document.createElement("div");
    chessPiece.classList.add("piece");
    chessPiece.dataset.piece = piece;
    chessPiece.dataset.color = color;
    chessPiece.innerText = chessmap[color][piece];
    return chessPiece;
}

function attackHim() {
    socket.emit("new_piece", { name: "general", color: "red" });
}

// socket.on("new_piece", piece => {
//     messages.appendChild(newPiece(piece.name, piece.color));
// });


document.querySelectorAll('.chessboard li').forEach(piece => {
    piece.draggable = true;
    piece.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.innerText);
    });
});

document.querySelectorAll(".chessboard").forEach(board => {
    board.addEventListener('dragover', e => e.preventDefault());
    board.addEventListener('drop', e => {
        e.preventDefault();
        const piece = e.dataTransfer.getData('text/plain');
        e.target = piece;
        
        renderPiece();
    });
});

// Chat handling
function sendMsg(type) {
    if (type == "global") {
        const globalInput = document.querySelector("input#global");
        if (globalInput.value == "") return;
        const content = globalInput.value;
        globalInput.value = "";
        socket.emit("chat", { username, room: roomId, content, type });
    } else if (type == "room") {
        const roomInput = document.querySelector("input#room");
        if (roomInput.value == "") return;
        const content = roomInput.value;
        roomInput.value = "";
        socket.emit("chat", { username, room: roomId, content, type });
    }
}
socket.on("chat", message => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${message.username}:</b> ${message.content}`;
    if (message.type == "global") document.querySelector("section.global-chat ul").appendChild(li);
    else if (message.type == "room") document.querySelector("section.room-chat ul").appendChild(li);
    li.parentElement.scrollTop = li.parentElement.scrollHeight;
});
document.querySelector("input#global").addEventListener("keypress", e => {
    if (e.key == "Enter") sendMsg("global");
});
document.querySelector("input#room").addEventListener("keypress", e => {
    if (e.key == "Enter") sendMsg("room");
});