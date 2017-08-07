var Games = [];
var Game = require("./game.js")["Game"];
module.exports = {
  Lobby: function () {
    this.users = [];
    var countDownStarted = false;
    const maxUsers = 4;
    const countDownTime = 15 * 1000;
    this.countDownStartTime;
    this.addUser = function (user) {
      stopCountDown = false;
      if (!countDownStarted) {
        countDownStarted = true;
        this.countDownStartTime = new Date();
        setTimeout(()=>{this.startGame()}, countDownTime);
      }
      if (this.users.length === maxUsers - 1) {
        this.users.push(user);
        this.startGame();
      }
      else {
        this.users.push(user);
      }
    };

    this.removeUser = function (id) {
      this.users = this.users.filter(u => u.id !== id);
      if (this.users.length === 0) {
        countDownStarted = false;
      }
    };

    this.startGame = function () {
      if (countDownStarted) {
        var game = new Game(this.users);
        Games.push(game);
        this.users.forEach(u=>{
          u.game = game;
          u.inGame = true;
        });
        this.users = [];
      }
      countDownStarted = false;
    };
  }
}