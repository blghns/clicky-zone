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

function resetTimer() {
  currentMillis = millis();
  projectedMillis = currentMillis + 3000;
  timeLeft = projectedMillis - currentMillis;
}

function mousePressed() {
  var d = dist(mouseX, mouseY,
    x, y);
  if (d < ellipseDiameter / 2) {
    //inside the circle
    oldX = x;
    oldY = y;
    newLocation();
    newX = x;
    newY = y;
    resetTimer();
    ellipseColor = color(random(0, 255),
      random(0, 255), random(0, 255));
    newAnimation(oldX, oldY, newX, newY);
    score++;
    if(ellipseDiameter > 10)
      ellipseDiameter = ellipseDiameter - 10;
  } else {
    //outside the circle
    alert("Clicked Outside! Your score: " + score);
    score = 0;
    ellipseDiameter = ellipseDiameterMax;
    resetTimer();
  }
}

function newLocation() {
  x = random(ellipseDiameter / 2,
    canvasWidth - ellipseDiameter / 2);
  y = random(ellipseDiameter / 2,
    canvasHeight - ellipseDiameter / 2);
}