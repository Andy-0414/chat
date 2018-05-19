var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

server.listen(3000);

app.get('/', (req, res) => {
    res.render('index');
})

// room
var userList = [];

io.on('connection', socket => {
    socket.on('join', dataR => {
        var roomId = dataR.room;
        var roomIdx = userList.findIndex(x => x.roomId == roomId);
        if(roomIdx == -1)
        {
            userList.push({
                roomId: roomId,
                user: []
            });
            roomIdx = userList.findIndex(x => x.roomId == roomId);
        }
        socket.join(roomId);
        userList[roomIdx].user.push({
            id: socket.id,
            userName: dataR.name
        });
        io.to(roomId).emit('user', { userList: userList[roomIdx].user });
        io.to(roomId).emit('chatReq', {
            userName: "<h1>System</h1>",
            message: "joinUser : " + dataR.name + "<br>room : " + roomId
        });

        socket.on('chat', data => {
            io.to(roomId).emit('chatReq', data);
        });

        socket.on('disconnect', () => {
            userList[roomIdx].user.splice(userList[roomIdx].user.indexOf(socket.id), 1);
            io.to(roomId).emit('user', { userList: userList[roomIdx].user });
        });
    });

});

