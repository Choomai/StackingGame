socket.on("room_created", room => {
    window.location.href = `/game?id=${room}`;
});

document.querySelector("button.new-game").addEventListener("click", () => {
    socket.emit("new_room");
});