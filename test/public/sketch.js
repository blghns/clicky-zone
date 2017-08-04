var socket;
var user;
var users = [];

function setup() {
  createCanvas(600, 600);
  socket = io.connect('http://witr90gme4p.wit.private:3000');
  user = new User(random(width), random(height));

  socket.on('heartbeat',
    function(data) {
      users = data.users;
    }
  );
  sendUserData("start")
}

function draw() {
  background(140);
  users.forEach(u => showUser(u));
  setNewUserPos();
  sendUserData("update");
}

function setNewUserPos() {
  user.mouseX = mouseX;
  user.mouseY = mouseY;
}

function sendUserData(method) {
  var data = {
    mouseX: user.mouseX,
    mouseY: user.mouseY
  };
  socket.emit(method, data);
}

function showUser(u) {
  fill(...u.color);
  ellipse(u.mouseX, u.mouseY, 20, 20);
}

