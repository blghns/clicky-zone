var Victor = require('victor');
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
var gameIds = 0;

module.exports = {
  Game: function (users) {
    this.gameId = gameIds;
    gameIds++;
    this.users = users;
    this.king = users[0];
    var getNewObjective = function (didKingClicked) {
      if (didKingClicked) {
        var newSize = this.objective.size/1.5;
        if (newSize < 20)
          newSize = 20;
        return {
          x: getRandomArbitrary(0, 1000),
          y: getRandomArbitrary(0, 500),
          size: newSize
        };
      }
      else {
        return {
          x: getRandomArbitrary(0, 1000),
          y: getRandomArbitrary(0, 500),
          size: 200
        };
      }
    }.bind(this);

    this.objective = getNewObjective(false);
    this.users.forEach(u => {
      u.inGame = true;
      u.game = this;
    });
    this.time = 60; // 60 secs

    this.scores = this.users.reduce((a, b) => {
      a[b.id] = 0;
      return a
    }, {});
    this.removeUser = function (id) {
      this.users = this.users.filter(u => u.id !== id);
      if (this.users.length === 0) {
        this.endGame()
      }
    };

    this.update = function () {
      users.forEach(u => u.update());
    };

    var multiplier = 1;
    this.clicked = function(u) {
        var pos = u.getPos();
        var vec1 = new Victor(pos.x, pos.y);
        var vec2 = new Victor(this.objective.x, this.objective.y);
        var dist = vec1.distance(vec2); //TODO: get distance sq
        var userR = 10;
        if (dist < (this.objective.size/2) + userR) {
          this.scores[u.id] += multiplier;
          if (u === this.king) {
            this.objective = getNewObjective(true);
            multiplier += 1;
          } else {
            this.objective = getNewObjective(false);
            this.king = u;
            multiplier = 1;
          }
        }
        else {
          this.scores[u.id] -= 1;
          multiplier = 1;
        }
    };

    this.endGame = function () {
      users.forEach(u => u.socket.emit('endGame', this.scores))
    };
    setInterval(() => {
      if (this.time <= 0) {
        this.endGame();
      }
      this.time--;
    }, 1000);
  }
}