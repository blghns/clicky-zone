var Victor = require('victor');
module.exports = {
  Blob: function (x, y) {
    this.pos = new Victor(x, y);
    this.vel = new Victor(0, 0);
    this.acc = new Victor(0, 0);
    this.fric = -0.1;
    this.r = 20;

    this.update = function () {
      this.vel.add(this.acc);
      this.vel.limit(5, 0.5);
      this.pos.add(this.vel);
      var fricForce = new Victor(this.vel.x, this.vel.y);
      fricForce.normalize();
      fricForce.multiply(new Victor(this.fric, this.fric));
      this.vel.add(fricForce);
      this.acc.multiply(new Victor(0, 0));
    };

    this.attracted = function (x, y) {
      if(x === undefined || y === undefined)
        return;
      var force = new Victor(x, y);
      force.subtract(this.pos);
      var d = force.magnitude();
      if (d < this.r / 2) {
        return;
      } else if (d < this.r) {
        var strength = d / 100;
      } else {
        if (d > 20)
          d = 20;
        if (d < 1)
          d = 1;
        var G = 500;
        var strength = G / (d * d);
      }
      force.normalize().multiply(new Victor(strength, strength));
      this.acc.add(force);
    };
  }
}