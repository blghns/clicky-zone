var canvasWidth = 800;
var canvasHeight = 900;
var x = 25;
var y = 25;
var ellipseDiameterMax = 400;
var ellipseDiameter = ellipseDiameterMax;
var ellipseColor;
var score = 0;
var timeLeft = 0;
var currentMillis = 0;
var projectedMillis = 0;
var animationTime = 0; // btw 0 - 1
var newX = 50;
var newY = 50;
var oldX = x;
var oldY = y;



function setup() {
    createCanvas(canvasWidth, canvasHeight);
    newLocation();
    resetTimer();
    ellipseColor = color(255, 0, 0);
    socket = io.connect('http://localhost:3000/');

    socket.emit('start');

    socket.on('heartbeat',
        function(data) {

        }
    )
}

function draw() {
    background(51);
    fill(255, 0, 0);
    text("Score: " + score, 10, 30);
    textSize(32);
    text("Time left: " + (timeLeft / 1000).toFixed(1) + "s", 10, 60);

    if (animationTime > 0)
        animateToNewLocation();
    else {
        fill(ellipseColor);
        ellipse(x, y, ellipseDiameter, ellipseDiameter);
        currentMillis = millis();
        timeLeft = projectedMillis - currentMillis;
        if (timeLeft < 0) {
            alert("Out of time! Score: " + score);
            resetTimer();
            score = 0;
            ellipseDiameter = ellipseDiameterMax;
        }
    }
}

function newAnimation(olX, olY, nX, nY) {
    oldX = olX;
    oldY = olY;
    newX = nX;
    newY = nY;
    animationTime = 1;
}

function animateToNewLocation() {
    var lerpX = lerp(oldX, newX, 1 - animationTime);
    var lerpY = lerp(oldY, newY, 1 - animationTime);
    fill(ellipseColor);
    ellipse(lerpX, lerpY, ellipseDiameter, ellipseDiameter);
    animationTime -= 0.1;
}

function mousePressed() {

    var data = {
        x:  mouseX,
        y: mouseY,
        ellipseDiameter: ellipseDiameter
    };

    socket.emit('update', data)
    console.log("Score: "+score)
}
