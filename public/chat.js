var socket = io();
var inText = document.getElementById('inText');
var userName = document.getElementById('userName');
var startName = document.getElementById('startName');
var userList = document.getElementById('userList');

function createChat(name, message) {
    var chatList = document.getElementById('chatList');
    var msg = document.createElement('div')
    msg.classList = "chatBar"
    msg.innerHTML = name + " : " + message;
    chatList.appendChild(msg);
    chatList.scrollTop = chatList.scrollHeight - chatList.clientHeight;
}

function joinRoom() {
    var room = document.getElementById('joinRoom').value;
    socket.emit("join", {
        room: room,
        name: startName.value
    });
    userName.value = startName.value;
    document.getElementById("join").remove();
}

function sendServer() {
    socket.emit('chat', {
        userName: userName.value,
        message: inText.value
    });
    inText.value = '';
}
socket.on('chatReq', data => {
    createChat(data.userName, data.message)
});
socket.on('user', data => {
    userList.innerHTML = "";
    for (u in data.userList) {
        var user = document.createElement("p");
        user.innerText = data.userList[u].userName;
        userList.appendChild(user);
    }
})