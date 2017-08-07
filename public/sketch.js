var userName = "";

function joinLobby(e) {
  userName = document.getElementById("alias").value;
  e.preventDefault();
  document.body.innerHTML = '<div id="tableContainer">'+
    '  <table class="table table-inverse table-condensed">'  +
    '       <thead>'  +
    '       <tr>'  +
    '           <th>Player</th>'  +
    '           <th>Score</th>'  +
    '           <th></th>'  +
    '       </tr>'  +
    '       </thead>'  +
    '       <tbody id="score-table-body">'  +
    '       </tbody>'  +
    '  </table>' +
    '</div>';
  var myp5 = new p5(sketch);
}

var sketch = function (p) {
  var socket;
  var inGame = false;
  var users;
  var king;
  var objective;
  var eta = 15;
  var remainingTime = 60;
  p.setup = function () {
    p.createCanvas(1000, 500);

    socket = io.connect('http://' + hostName);

    socket.on('inLobby',
      function (data) {
        console.log(data);
        var lobbyTime = new Date(data.countDownStartedAt);
        var currentTime = new Date();
        var diff = currentTime.getTime() - lobbyTime.getTime();
        eta = (15 - diff / 1000);
        console.log("Count Down: " + eta);
        inGame = false;

      }
    );
    var initBoard = true;
    socket.on('inGame',
      function (data) {
        remainingTime = data.remainingTime;
        users = data.users;
        if(initBoard){
          initScoreboard(data.users);
          initBoard = false;
        }
        else
          updateScoreboard(data);
        objective = data.objective;
        inGame = true;
        king = data.king;
      }
    );
    var runOnce = true;
    socket.on('endGame',
      function (data) {
        if(runOnce) {
          // TODO: display scoreboard/winner?
          // refresh page after 10 seconds
          runOnce = false;
          var winner = Object.keys(data).reduce(function(a, b){ return data[a] > data[b] ? a : b });
          var user = users.find(u => u.id === winner);
          alert("Winner is: " + user.name);
          inGame = false;
          location.reload();
        }
      }
    );
    sendStartData();
  }

  p.draw = function () {
    p.background(140);
    if (inGame) {
      var userColor = users.find(u=>u.id === socket.id).col;
      p.fill(...userColor);
      p.textSize(32);
      p.text("Time: " + Math.ceil(remainingTime), 10, 30);
      var kingColor = users.find(u=>u.id === king).col;
      p.fill(...kingColor);
      p.ellipse(objective.x, objective.y, objective.size);
      users.forEach(u => {
        p.fill(...u.col);
        p.ellipse(u.x, u.y, 20);
      })
    }
    else {
      p.fill(0);
      p.ellipse(p.mouseX, p.mouseY, 20);
      p.textSize(32);
      p.text("Game starts in: " + Math.ceil(eta), 10, 30);
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
    socket.emit('clicked');
  }

  function sendUpdateData() {
    var data = {
      mouseX: p.mouseX,
      mouseY: p.mouseY
    };
    socket.emit('update', data);
  }
}

