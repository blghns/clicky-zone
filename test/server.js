var users = [];

function User(id, mouseX, mouseY, color) {
  this.id = id;
  this.mouseX = mouseX;
  this.mouseY = mouseY;
  this.color = color;
}

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
  io.sockets.emit('heartbeat', {users: users});
}

var lockedUsers = new Set();

function userLocked(id) {
  if (lockedUsers.has(id)) {
    return true;
  }
  else{
    lockedUsers.add(id);
    setTimeout(_ => lockedUsers.delete(id), 33);
  }
}

io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    socket.on('start',
      function(data) {
        console.log("We have a new client: " + socket.id);
        console.log(socket.id + " " + data.x + " " + data.y);
        var u = new User(socket.id, data.x, data.y, [getRandomArbitrary(0, 255), getRandomArbitrary(0, 255), getRandomArbitrary(0, 255)]);
        users.push(u);
      }
    );

    socket.on('update',
      function(data) {
        if(!userLocked(socket.id)){
          var u = users.find(e => e.id === socket.id);
          if(data.mouseX !== undefined)
            u.mouseX = data.mouseX;
          if(data.mouseY !== undefined)
            u.mouseY = data.mouseY;
        }
      }
    );


    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      var index = users.indexOf(e => e.id === socket.id);
      users.splice(index, 1);
    });
  }
);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}