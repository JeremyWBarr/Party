joined      = false;
updated     = false;
nickname    = '';
usercolor   = '';
updatedata  = [];

socket.on('joined', function(nn, c){
    joined      = true;
    nickname    = nn;
    usercolor   = c;
});

socket.on('update', function(d){
    updated     = true;
    updatedata  = d;
});

function setup() {
    createCanvas(640,360);
}

function draw() {
    background(150);

    socket.emit('update', {
        'up':       keyIsDown(87),
        'right':    keyIsDown(68),
        'left':     keyIsDown(65),
        'down':     keyIsDown(83)
    });
    if(updated) {
        updatedata.forEach(function(player){
            fill(color(player.color));
            circle(player.playerdata.x, player.playerdata.y, 10);
        });
    }
}