socket.emit("options", { players: 4, room: 0 });
const messages = document.querySelector("ul#messages");

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
}

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

socket.on("new_piece", piece => {
    messages.appendChild(newPiece(piece.name, piece.color));
})

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