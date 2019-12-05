var express     = require('express');
var app         = express();
var path        = require('path');
var http        = require('http').createServer(app);
var io          = require('socket.io')(http);

var lobbies     = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.redirect('index.html');
});

app.get('/lobby/:id', function(req, res){
    res.sendFile('lobby.html', {root: __dirname+'/public'});
});

io.on('connection', function(socket){

    username    = '';
    room        = '';

    console.log('A user connected.');

    socket.on('disconnect', function(){
        console.log('A user disconnected.');
    });

    socket.on('login', function(un){
        username = un;
    });

    socket.on('createLobby', function() {
        var id      = Math.random().toString(36).substring(2, 10);
        var name    = username + "'s Lobby";
        var lobby = new Lobby(id, name);
        lobbies.push(lobby);

        socket.join(id);
        room = id;
        socket.emit('redirect', '/lobby/'+id);

        io.emit('updateLobbies', lobbies);
    });

    socket.on('getUsername', function(){
        socket.emit('getUsernameCallback', username);
    });

    socket.on('getLobby', function(id) {
        name = '';
        lobbies.forEach(function(lobby){
            console.log(lobby.id);
            if(lobby.id == id)
                name = lobby.name;
        });
        socket.emit('getLobbyCallback', name);
    })

    socket.on('getLobbies', function(id) {
        socket.emit('updateLobbies', lobbies);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

class Lobby {
    constructor(i, n) {
        this.id = i;
        this.name = n;
    }
}