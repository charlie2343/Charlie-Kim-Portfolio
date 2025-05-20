let c1;
let c2;
let c3;
let allCircles;
let queue;
let epsilon = 0.1;
let stopRadius = 10;

// function findC3center(k3,c1,c2){ 
//   let r3 = 1/k3; 
  
//   let x1 = c1.center.a
//   let y1 = c1.center.b
//   let x2 = c2.center.a
//   let y2 = c2.center.b
  
//   let d = dist(x1,y1,x2,y2);
//   console.log('radius ', r3);
//   let inside = (abs(r3 - c1.radius))*(abs(r3 - c1.radius)) - (d/2)*(d/2);
//   console.log('inside: ', inside)
// if (inside < 0) {
//   console.error('BAD CONFIGURATION: cannot build c3, inside sqrt is negative:', inside);
//   return null;
// }
// let h = sqrt(inside);
  
//   let medianx = (x1+x2)/2;
//   let mediany = (y1+y2)/2;
  
//   let ux = (x2-x1)/d;
//   let uy = (y2-y1)/d;
//   let c3x = medianx + h * -uy; 
//   console.log(c3x)
//   let c3y = mediany + h * ux; 
  
//   return { x: c3x, y: c3y }
// // let a = c1.radius -r3;
// // let b = r3 + c2.radius;
// // let c = c1.radius - c2.radius; 
// //   let theta = 
// }

function getAngle(x, y, z){ 
return acos((pow(x,2) - pow(y,2) - pow(z, 2))/(-2*y * z));
}

function getStraight(){ 

}
function findC3center(k3,c1,c2){ 
  let r3 = 1/k3; 
  
  
  let A = dist(x1,y1,x2,y2);
  let B = r3 + c2.radius; 
  let C = r3 - c1.radius; 
  
  let theta = getAngle(B, A, C);
  
} 

  
  
  

function setup() {
  //randomSeed(4);
  startColor = color(random(0,255), random(0,255) ,random(0,255));
  //createCanvas(400, 400);
  createCanvas(windowWidth, windowHeight);
 size = width/2
  c1 = new Circle(-1 / (width/2), width/2, height/2, startColor);
  //create 3 random mutually tangent circle
  //pick random curvature
  let randomR2 = random(20,c1.radius/3);
  //console.log(randomR2)
  //given set distance we want to find any possible x,y in that cirlce that will be mutually tangent 
  let c1c2dist = size- randomR2; 
  let xdisp = random(-c1c2dist, c1c2dist);
  console.log(xdisp)
  let ydisp = sqrt(pow(c1c2dist,2)- pow(xdisp,2));
  if (random() < 0.5) {
  ydisp = -ydisp;
}
  console.log(ydisp)
  let c2 = new Circle(1/randomR2,size+xdisp, height/2 + ydisp, startColor);
  
  let k1 = c1.bend; 
  let k2 = c2.bend; 
  
  let x1 = c1.center.a
  let y1 = c1.center.b
  let x2 = c2.center.a
  let y2 = c2.center.b
  
 // let k3a = k1 + k2 + sqrt(k1 * k2); //internall tangent
  //let k3b = k1 + k2 + 2 * sqrt(abs(k1 * k2)); // internal to c1
  
  
  //let c3center = findC3center(k3b, c1, c2);
  
  let r3 = c1.radius-c2.radius; 
  let v = createVector(x2-x1, y2-y1)
  v.rotate(PI)
  v.setMag(c1.radius- r3)
  //console.log('k3b: ', k3b)
  c3 = new Circle(1/r3, width/2 + v.x, height/2 + v.y, startColor);
  
  
  // c2 = new Circle(1 / 100, 100, 200);
  // c3 = new Circle(1 / 100, 300, 200);
  allCircles = [c1, c2, c3];
  queue = [[c1, c2, c3]];
}

function isTangent(c4, other) {
  let centerDist = c4.dist(other);
  let radiusDiff = abs(c4.radius - other.radius);
  let radiusSum = abs(c4.radius + other.radius);
  return (
    abs(centerDist - radiusDiff) < epsilon || abs(centerDist - radiusSum) < epsilon
  );
}


function validate(c4, c1, c2, c3) {
  // Discards too small circles to avoid infinite recursion
  if (c4.radius < 2) return false;

  for (let other of allCircles) {
    let d = c4.dist(other);
    let radiusDiff = abs(c4.radius - other.radius);
    // Ensures new circle doesn't overlap or is too close to existing circles
    if (d < epsilon && radiusDiff < epsilon) {
      return false;
    }
  }

  // Check if all 4 circles are mutually tangential
  if (!isTangent(c4, c1)) return false;
  if (!isTangent(c4, c2)) return false;
  if (!isTangent(c4, c3)) return false;

  return true;
}

function nextGeneration() {
  let nextQueue = [];
  for (let triplet of queue) {
    //run find curve on triplet queue
    //run complex descarte on bnoth curvatures and the triplet, for each circle generated add another triplet
    let c1 = triplet[0];
    let c2 = triplet[1];
    let c3 = triplet[2];
    let k4 = findCurvature(c1, c2, c3);
    console.log("k4" , k4)
    let newCircles = complexDescarte(c1, c2, c3, k4);
    console.log(complexDescarte[(c1, c2, c3, k4)]);

    for (let newCircle of newCircles) {
      if (validate(newCircle,c1,c2,c3)) {
        allCircles.push(newCircle);
        let t1 = [c1, c2, newCircle];
        let t2 = [c2, c3, newCircle];
        let t3 = [c1, c3, newCircle];
        nextQueue = nextQueue.concat([t1, t2, t3]);
      }
    }
  }
  //console.log(nextQueue);
  queue = nextQueue;
  //console.log(allCircles);
}
function findCurvature(c1, c2, c3) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;
  let sum = k1 + k2 + k3;
  let root = 2 * sqrt(abs(k1 * k2 + k2 * k3 + k3 * k1));
  console.log(root);

  return [sum + root, sum - root];
}

function complexDescarte(c1, c2, c3, k4) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;
  let z1 = c1.center;
  let z2 = c2.center;
  let z3 = c3.center;
  let sum = z1.scale(k1).add(z2.scale(k2)).add(z3.scale(k3));
  let discriminant = z1
    .mult(z2)
    .scale(k1 * k2)
    .add(z2.mult(z3).scale(k2 * k3))
    .add(z1.mult(z3).scale(k1 * k3));
  
  let root = discriminant.sqrt().scale(2);
  //console.log(root)
  // return [
  //   //smaller radii circles are [0] bigger are 1
  //   sum.add(root).scale(1 / k4[0]), sum.sub(root).scale(1 / k4[0]),
  //         sum.add(root).scale(1 / k4[1]), sum.sub(root).scale(1 / k4[1])
  //        ];
  let center1 = sum.add(root).scale(1 / k4[0]);
  let center2 = sum.sub(root).scale(1 / k4[0]);
  let center3 = sum.add(root).scale(1 / k4[1]);
  let center4 = sum.sub(root).scale(1 / k4[1]);
  let newColor = color(random(0,255), random(0,255) ,random(0,255));
  return [
    new Circle(k4[0], center1.a, center1.b, newColor),
    new Circle(k4[0], center2.a, center2.b, newColor),
    new Circle(k4[1], center3.a, center3.b, newColor),
    new Circle(k4[1], center4.a, center4.b, newColor),
  ];
}

function mousePressed(){ 
save("Apollonian_Gasket.png");
}

function draw() {
  //background(220);
  //background(255);
  // let k4 = findCurvature(c1, c2, c3);
  // let z4 = complexDescarte(c1, c2, c3, k4);
  // let k5 = findCurvature(c1, c2, c3);
  // let z5 = complexDescarte(c1, c2, c3, k4)[0];
  //console.log(z5);
  //   let c5 = new Circle(k4[1], z4[1].a, z4[1].b);
  //   //console.log(z4[0]);

  //   let c4 = new Circle(k4[0], z4[0].a, z4[0].b);
  
  let len1 = allCircles.length;
  nextGeneration(); 
  let len2 = allCircles.length;
  
  // Stop drawing when no new circles are added
  if (len1 == len2) {
    console.log('done');
    noLoop();
  }
  for (let c of allCircles) {
    c.show();
  }
}
