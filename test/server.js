
var Blob = require('./blob.js')['Blob'];
var Game = require('./game.js')['Game'];
var Lobby = require('./lobby.js')['Lobby'];
var User = require('./user.js')['User'];
var users = [];
var lobby = new Lobby();

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Clicky zone listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
  users.forEach(u => {
    if (u.inGame) {
      var users = u.game.users.map(e => {
        var pos = e.getPos();
        return {id: e.id, name: e.name, x: pos.x, y: pos.y, col: e.color};
      });
      // calculateObjective and score
      u.game.update();
      u.socket.emit('inGame', {
        users: users,
        scores: u.game.scores,
        objective: u.game.objective,
        remainingTime: u.game.time
      });
    }
    else {
      u.socket.emit('inLobby', {
        userCount: lobby.users.length,
        countDownStartedAt: lobby.countDownStartTime
      });
    }

  });
  //io.sockets.emit('heartbeat', {users: users});
}

var lockedUsers = new Set();

function userLocked(id) {
  if (lockedUsers.has(id)) {
    return true;
  }
  else {
    lockedUsers.add(id);
    setTimeout(() => lockedUsers.delete(id), 33);
  }
}

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    socket.on('start',
      function (data) {
        console.log("We have a new client: " + socket.id);
        console.log(socket.id + " " + data.x + " " + data.y);
        var u = new User(socket.id, data.name, data.x, data.y, [getRandomArbitrary(0, 255), getRandomArbitrary(0, 255),
                                                                getRandomArbitrary(0, 255)], socket);
        lobby.addUser(u);
        users.push(u);
      }
    );

    socket.on('update',
      function (data) {
        if (!userLocked(socket.id)) {
          var u = users.find(e => e.id === socket.id);
          if (u !== undefined) {
            if (data.mouseX !== undefined) {
              u.mouseX = data.mouseX;
            }
            if (data.mouseY !== undefined) {
              u.mouseY = data.mouseY;
            }
            if (data.clicked !== undefined) {
              u.clicked = data.clicked;
            }
          }
        }
      }
    );

    socket.on('disconnect', function () {
      console.log("Client has disconnected");
      var u = users.find(e => e.id === socket.id);
      if (u !== undefined) {
        if (u.inGame) {
          var game = u.game;
          game.removeUser(socket.id);
        }
        else {
          lobby.removeUser(socket.id);
        }
      }

    });
  }
);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}