const G = 1;
let pies;

let star;
let planets;
let numPlanets;

let colors;
let spawn;

let scaleAmount;
let scaleFactor;

// Get a random color out of an array
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
};

function setup() {
	createCanvas(windowWidth, windowHeight);
	star = new Star(0, 0, 0, 0, 100, 100, "yellow");

	scaleAmount = 1.0;
	scaleFactor = 0.1;

	spawn = true;

	pies = [HALF_PI, -HALF_PI];
	colors = [
		'#267365',
		'#F29F05',
		'#F28705',
		'#F23030'
	];

	planets = [];
	numPlanets = random(8, 10);

	for (let i = 0; i < numPlanets; i++) {
		createOrbitingPlanet();
	}
}

function draw() {
	translate(width/2, height/2);
	scale(scaleAmount);
	background("gray");

	for (let i = 0; i < planets.length; i++) {
		star.attract(planets[i]);
		planets[i].update();
		planets[i].draw();
		planets[i].drawArrow();
		planets[i].drawTrace();
	}
	star.draw();
}


function createOrbitingPlanet() {
	let color = randomColor(colors);
	let r = random(20, 50);
	let m = r;
	
	// planet position
	let rand = random(star.r + r, min(windowWidth/2, windowHeight/2));
	let theta = random(TWO_PI);
	let planetPos = createVector(rand*cos(theta), rand*sin(theta));
	
	// planet velocity
	let planetVel = planetPos.copy();
	planetVel.rotate(pies[Math.floor(Math.random() * pies.length)]);
	
	planetVel.setMag(sqrt(G*star.mass/planetPos.mag()));
	planets.push(new Planet(planetPos.x, planetPos.y, planetVel.x, planetVel.y, m, r, color));
}

function mouseClicked() {
	if (spawn && planets.length <= 15) {
		createOrbitingPlanet();
	}
}

function disableSpawn() {
	spawn = false;
}

function enableSpawn() {
	spawn = true;
}

function mouseWheel(event) {
	if (event.deltaY > 0) {
		scaleAmount -= scaleFactor;
	} else {
	  	scaleAmount += scaleFactor;
	}
	
	// limit the scale amount to prevent zooming too far in/out
	scaleAmount = constrain(scaleAmount, 0.1, 1000.0);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}