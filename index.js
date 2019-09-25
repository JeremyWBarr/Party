var app     = require('express')();
var http    = require('http').createServer(app);
var io      = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    var nickname = "anon";

    console.log('A user connected.');

    socket.on('disconnect', function(){
        console.log('A user disconnected.');
    });

    socket.on('nickname', function(nn){
        nickname = nn;
    });

    socket.on('chat message', function(message){
        io.emit('chat message', nickname+": "+message);
        socket.emit('chat message', 'you spoke!');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});