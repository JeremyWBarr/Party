var canvasWidth     = 800,
    canvasHeight    = 450,

    Engine          = Matter.Engine,
    Render          = Matter.Render,
    World           = Matter.World,
    Body            = Matter.Body,
    Bodies          = Matter.Bodies,
    Composite       = Matter.Composite,
    Query           = Matter.Query,

    engine,

    player,
    platform,
    ground;

function setup() {
    createCanvas(canvasWidth, canvasHeight);

    engine = Engine.create();
    engine.world.gravity.scale = 0.004;

    player = Bodies.rectangle(canvasWidth/2, canvasHeight - 200, 40, 40);
    player.isJumping    = false;
    player.jumpTime     = 0;
    player.maxJumpTime  = 10;

    ground = Bodies.rectangle(canvasWidth/2, canvasHeight, 810, 60, {
        isStatic: true
    });

    platform = Bodies.rectangle(canvasWidth/2, 3*canvasHeight/4, 200, 30, {
        isStatic: true
    });

    World.add(engine.world, [player, platform, ground]);

    Engine.run(engine);
}

function draw() {
    background(51);

    controls();
    
    drawBody(player, 255);
    drawBody(platform, 0);
    drawBody(ground, 0);
}

function controls() {
    // LEFT / RIGHT
    if(!(keyIsDown(65) ^ keyIsDown(68))) {

        Body.setVelocity(player, {x: 0, y: player.velocity.y});

    // LEFT
    } else if(keyIsDown(65)) {

        Body.setVelocity(player, {x: -5, y: player.velocity.y});

    // RIGHT
    } else if(keyIsDown(68)) {

        Body.setVelocity(player, {x: 5, y: player.velocity.y});

    }

    // UP
    if(keyIsDown(32) || keyIsDown(87)) {
        if(!player.isJumping  && Query.point([platform, ground], {x: player.position.x, y: player.position.y+25}).length > 0) {
            player.isJumping    = true;
            player.jumpTime     = 0;
        }
    } else {
        player.isJumping        = false;
    }

    if(player.isJumping) {
        player.jumpTime++;

        if(player.jumpTime < player.maxJumpTime)
            Body.setVelocity(player, {x: player.velocity.x, y: -15});
    }

    Body.setAngle(player, 0);
}

function drawBody(body, color) {
    var vertices = body.vertices;

    beginShape();
    fill(color);
    for (var i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape();
}