var Blob = require('./blob.js')['Blob'];
module.exports = {
  User: function (id, name, mouseX, mouseY, color, socket) {
    this.id = id;
    this.name = name;
    this.inGame = false;
    this.game;
    this.socket = socket;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.color = color;
    this.clicked = false;
    this.blob = new Blob(this.mouseX, this.mouseY);
    this.update = function () {
      this.blob.attracted(this.mouseX, this.mouseY);
      this.blob.update();
    };
    this.getPos = function () {
      return {x: this.blob.pos.x, y: this.blob.pos.y};
    };
  }
}
