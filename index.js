var express     = require('express');
var app         = express();
var path        = require('path');
var http        = require('http').createServer(app);
var io          = require('socket.io')(http);
var numusers   = 0;
var userlist  = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.redirect('index.html');
});

io.on('connection', function(socket){
    var usernum     = ""
    var joined      = false;

    console.log('A user connected.');
    socket.emit('playerupdate', userlist);

    socket.on('disconnect', function(){
        console.log('A user disconnected.');
        userlist.forEach(function(user, index){
            if(user.usernum == usernum) {
                numusers--;
                userlist.splice(index, 1);

                userlist.forEach(function(user, index){
                    user.usernum = (index+1).toString();
                });
            }
        });
        playerupdate();
    });

    socket.on('join', function(nn, c){
        if(joined == false && numusers <= 4) {
            joined = true;
            numusers++;

            usernum     = numusers.toString();

            userlist.push({
                'usernum':  usernum,
                'nickname': nn, 
                'color':    c,
                'playerdata': {
                    'x': 0,
                    'y': 0
                }
            });
            playerupdate();
        } else {
            userlist.forEach(function(user){
                if(user.usernum == usernum) {
                    user.nickname   = nn;
                    user.color      = c;
                    playerupdate();
                }
            });
        }

        socket.emit('joined', nn, c);
    });

    socket.on('update', function(data){
        userlist.forEach(function(user){
            if(user.usernum == usernum) {
                user.playerdata.x += 5*data.right;
                user.playerdata.x -= 5*data.left;
                user.playerdata.y += 5*data.down;
                user.playerdata.y -= 5*data.up;
                socket.emit('update', userlist);
            }
        });
    });
});

function playerupdate() {
    console.log(userlist);
    io.emit('playerupdate', userlist);
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});
