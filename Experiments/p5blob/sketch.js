var elements = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  elements.push(new blob(windowWidth / 2, windowHeight / 2));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  elements.forEach(e => e.display());
}

function draw() {
  background(0);
  elements.forEach(e => e.attracted(createVector(mouseX, mouseY)));
  elements.forEach(e => e.update())
  elements.forEach(e => e.display());
}
