function blob(x, y) {
  this.pos = createVector(x, y);
  this.vel = new p5.Vector();
  this.acc = createVector();
  this.fric = -0.1;
  this.r = blob.r;
  this.ctr = random(1000);

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    var fricForce = createVector(this.vel.x, this.vel.y);
    fricForce.normalize();
    fricForce.mult(this.fric);
    this.vel.add(fricForce);
    this.acc.mult(0);
    this.ctr += 0.02;
  }

  this.display = function() {
    push();
    smooth();
    translate(this.pos.x, this.pos.y);
    fill(200);
    beginShape();
    for (var a = 0; a < TWO_PI; a += PI / 64) {
      var cos_a = cos(a),
        sin_a = sin(a),
        noi = noise(cos_a + 1, sin_a + 1, this.ctr),
        d = this.r + map(noi, -2, 1, -25, 25);
      vertex(d * cos_a, d * sin_a);
    }
    endShape();
    pop();
  }

  this.attracted = function(target) {
    var force = p5.Vector.sub(target, this.pos);
    var d = force.mag();
    if(d < this.r/2)
      return;
    else if (d < this.r)
      var strength = d/100;
    else {
      d = constrain(d, 1, this.r/2);
      var G = 500;
      var strength = G / (d * d);
    }
    force.setMag(strength);
    this.acc.add(force);
  }
}
blob.r = 40;
