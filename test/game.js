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
        return {
          x: getRandomArbitrary(0, 1000),
          y: getRandomArbitrary(0, 500),
          size: this.objective - 1
        };
      }
      else {
        return {
          x: getRandomArbitrary(0, 1000),
          y: getRandomArbitrary(0, 500),
          size: 200
        };
      }
    }

    this.objective = getNewObjective(false);
    this.users.forEach(u => {
      u.inGame = true;
      u.game = this;
    });
    this.time = 5 * 60; // 5 mins

    this.scores = this.users.map(u => {
      var obj = {};
      obj[u.id] = 0;
      return obj;
    });
    this.removeUser = function (id) {
      this.users = this.users.filter(u => u.id !== id);
      if (this.users.length === 0) {
        this.endGame()
      }
    };
    this.update = function () {
      var userR = 40;
      users.forEach(u => u.update());
      for (let i = 0; i < users.length; i++) {
        var u = users[i];
        var pos = u.getPos();
        var vec1 = new Victor(pos.x, pos.y);
        var vec2 = new Victor(this.objective.x, this.objective.y);
        var dist = vec1.distance(vec2); //TODO: get distance sq
        if (dist < this.objective.size + userR && u.clicked) {
          this.scores[u.id]++;
          if (u === this.king) {
            this.objective = getNewObjective(true);
          } else {
            this.objective = getNewObjective(false);
          }
        }
        else {
          this.scores[u.id]--;
        }
      }
    }
    this.endGame = function () {
      // TODO;
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