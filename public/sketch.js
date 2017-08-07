var userName = "";

function joinLobby(e) {
  userName = document.getElementById("alias").value;
  e.preventDefault();
  document.body.innerHTML = '';
  var myp5 = new p5(sketch);
}

var sketch = function (p) {
  var socket;
  var inGame = false;
  var users;
  var objective;

  p.setup = function () {
    p.createCanvas(1000, 500);

    socket = io.connect('http://' + hostName);

    socket.on('inLobby',
      function (data) {
        console.log(data);
        var lobbyTime = new Date(data.countDownStartedAt);
        var currentTime = new Date();
        var diff = currentTime.getTime() - lobbyTime.getTime();
        console.log("Count Down: " + (15 - diff / 1000));
        inGame = false;
      }
    );
    socket.on('inGame',
      function (data) {
        console.log(data);
        users = data.users;
        objective = data.objective;
        inGame = true;
      }
    );
    socket.on('endGame',
      function (data) {
        // TODO: display scoreboard/winner?
        // refresh page after 10 seconds
        console.log(data);
        inGame = false;
        debugger;
        location.reload();
      }
    );
    sendStartData();
  }

  p.draw = function () {
    p.background(140);
    if (inGame) {
      p.ellipse(objective.x, objective.y, objective.size);
      users.forEach(u => {
        p.fill(...u.col);
        p.ellipse(u.x, u.y, 20);
      })
    }
    else {
      p.fill(0);
      p.ellipse(p.mouseX, p.mouseY, 20);
    }
    sendUpdateData();
  }

  function sendStartData() {
    var data = {
      name: userName,
      x: p.mouseX,
      y: p.mouseY
    }
    socket.emit('start', data);
  }

  p.mousePressed = function() {
    sendUpdateData(true);
  }

  function sendUpdateData(clicked=false) {
    var data = {
      mouseX: p.mouseX,
      mouseY: p.mouseY,
      clicked: clicked
    };
    socket.emit('update', data);
  }

  function showUser(u) {
    p.fill(...u.color);
    p.ellipse(u.mouseX, u.mouseY, 20, 20);
  }
}

