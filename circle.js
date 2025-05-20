class Circle {
  constructor(bend, x, y, c) {
    this.center = new Complex(x, y);
    this.bend = bend;
    this.radius = abs(1 / this.bend);
    this.c  = c 
  }

  show() {
    stroke(0);
    fill(this.c);
    circle(this.center.a, this.center.b, this.radius * 2);
  }
  
 dist(other) {
  return dist(this.center.a, this.center.b, other.center.a, other.center.b);
}
}
