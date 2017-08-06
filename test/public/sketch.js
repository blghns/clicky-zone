var socket;
var inGame = false;
var users;
var objective;
function setup() {
  createCanvas(1000, 500);
  socket = io.connect('http://witr90gme4p.wit.private:3000');
  user = new User(random(width), random(height));

  socket.on('inLobby',
    function (data) {
      console.log(data);
      var lobbyTime = new Date(data.countDownStartedAt);
      var currentTime = new Date();
      var diff = currentTime.getTime() - lobbyTime.getTime();
      console.log("Count Down: " + (30 - diff/1000));
      inGame = false;
    }
  );
  socket.on('inGame',
    function (data) {
      //console.log(data);
      users = data.users;
      objective = data.objective;
      console.log(users[0]);
      inGame = true;
    }
  );
  socket.on('endGame',
    function (data) {
      console.log(data);
      inGame = false;
    }
  );
  sendStartData();
}

function draw() {
  background(140);
  if(inGame) {
    users.forEach(u => {
      fill(...u.col);
      ellipse(u.x, u.y, 20);
    })
  }
  sendUpdateData();
}

function sendStartData() {
  var data = {
    name: "User",
    x: mouseX,
    y: mouseY
  }
  socket.emit('start', data);
}

function sendUpdateData() {
  var data = {
    mouseX: mouseX,
    mouseY: mouseY,
    clicked: mouseIsPressed
  };
  socket.emit('update', data);
}

function showUser(u) {
  fill(...u.color);
  ellipse(u.mouseX, u.mouseY, 20, 20);
}

