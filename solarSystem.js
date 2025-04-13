const G = 1;
let pies;

let scaleAmount;
let scaleFactor;

let sun;
let planets;
let asteroids;
let asteroidsNum;
let allPlanets;


let colors;

let radiusOfTheSun;
let ratio;

// Get a random color out of an array
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
};

function setup() {
	createCanvas(windowWidth, windowHeight);

	planetScaling = 1000;
	ratio = windowWidth / 4616800000;
	scaleAmount = 0.4;
	scaleFactor = 0.05;

	planets = [];
	asteroids = [];
	asteroidsNum = 3000;

	radiusOfTheSun = planetScaling * ratio * 696340;
	sun = new Star(0, 0, 0, 0, 50, radiusOfTheSun, "yellow");
	
	allPlanets = [
		// Mercury
		{
			"pos": createVector(sun.r + ratio * 46125000, 0),
			"radius": planetScaling * ratio * 2439.7,
			"color": "#708090"
		},
		// Venus
		{
			"pos": createVector(sun.r + ratio * 107540000, 0),
			"radius": planetScaling * ratio * 6051.8,
			"color": "yellow"
		},
		// Earth
		{
			"pos": createVector(sun.r + ratio * 149520000, 0),
			"radius": planetScaling * ratio * 6371,
			"color": "aqua"
		},
		// Mars
		{
			"pos": createVector(sun.r + ratio * 248180000, 0),
			"radius": planetScaling * ratio * 3389.5,
			"color": "red"
		},
	
		// Asteroid Belt
	
		// Jupiter
		{
			"pos": createVector(sun.r + ratio * 740870000, 0),
			"radius": planetScaling * ratio * 69911,
			"color": "#A52A2A"
		},
		// Saturn
		{
			"pos": createVector(sun.r + ratio * 1466100000, 0),
			"radius": planetScaling * ratio * 58232,
			"color": "#A52A2A"
		},
		// Uranus
		{
			"pos": createVector(sun.r + ratio * 2939500000, 0),
			"radius": planetScaling * ratio * 25362,
			"color": "white"
		},
		// Neptune
		{
			"pos": createVector(sun.r + ratio * 4473300000, 0),
			"radius": planetScaling * ratio * 24622,
			"color": "blue"
		}
	];
		
		pies = [HALF_PI, -HALF_PI];
		
		for (let i = 0; i < allPlanets.length; i++) {
			let planetVel = allPlanets[i].pos.copy();
			// planetVel.rotate(pies[Math.floor(Math.random() * pies.length)]);
			planetVel.rotate(-HALF_PI)
			
			// planetVel.setMag(sqrt(G*sun.mass/allPlanets[i].pos.mag()));
			planetVel.setMag(sqrt(G*sun.mass/allPlanets[i].pos.mag()));
			planet = new Planet(allPlanets[i].pos.x,  allPlanets[i].pos.y, planetVel.x, planetVel.y, 1, allPlanets[i].radius, allPlanets[i].color);
			planets.push(planet);
		}
	
		// Asteroid Belt
		for (let i = 0; i < asteroidsNum; i++) {
			let rand = random(sun.r + ratio * 329000000, sun.r + ratio * 478700000);
			let theta = random(TWO_PI);
	
			let asteroidPos = createVector(rand*cos(theta), rand*sin(theta));
	
			let asteroidVel = asteroidPos.copy();
	
			asteroidVel.rotate(pies[Math.floor(Math.random() * pies.length)])
			
			asteroidVel.setMag(sqrt(G*sun.mass/asteroidPos.mag()));
			asteroid = new Asteroid(asteroidPos.x, asteroidPos.y, asteroidVel.x, asteroidVel.y, 1, random(0.2, 1));
			asteroids.push(asteroid);
		}

		// Kuiper Belt
		for (let i = 0; i < asteroidsNum; i++) {
			let rand = random(sun.r + ratio * 4488000000, sun.r + ratio * 7480000000);
			let theta = random(TWO_PI);
	
			let asteroidPos = createVector(rand*cos(theta), rand*sin(theta));
	
			let asteroidVel = asteroidPos.copy();
	
			asteroidVel.rotate(pies[Math.floor(Math.random() * pies.length)])
			
			asteroidVel.setMag(sqrt(G*sun.mass/asteroidPos.mag()));
			asteroid = new Asteroid(asteroidPos.x, asteroidPos.y, asteroidVel.x, asteroidVel.y, 1, random(0.2, 1));
			asteroids.push(asteroid);
		}


}

function draw() {
	translate(width/2, height/2);
	scale(scaleAmount);
	background("gray");

	for (let i = 0; i < planets.length; i++) {
		sun.attract(planets[i]);
		planets[i].update();
		planets[i].draw();
		planets[i].drawArrow();
		planets[i].drawTrace();
	}

	asteroids.forEach(asteroid => {
		sun.attract(asteroid);
		asteroid.update();
		asteroid.draw();
	});

	sun.draw();
}

function mouseWheel(event) {
	if (event.deltaY > 0) {
		scaleAmount -= scaleFactor;
	} else {
	  	scaleAmount += scaleFactor;
	}
	
	// limit the scale amount to prevent zooming too far in/out
	scaleAmount = constrain(scaleAmount, 0.1, 10.0);
}

document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowLeft") {
        moveLeft()
    }
    else if(event.key == "ArrowUp") {
        moveUp();
    }
    else if(event.key == "ArrowDown") {
        moveDown();
    }
    else if(event.key == "ArrowRight") {
        moveRight();
    }
});

function moveLeft() {
	planets.forEach(planet => {
		planet.pos.x -= 100;
		planet.history.forEach(historyPoint => {
			historyPoint.x -= 100;
		});
	});

	asteroids.forEach(asteroid => {
		asteroid.pos.x -= 100;
	});

	sun.pos.x -= 100;
}

function moveUp() {
	planets.forEach(planet => {
		planet.pos.y -= 100;
		planet.history.forEach(historyPoint => {
			historyPoint.y -= 100;
		});
	});

	asteroids.forEach(asteroid => {
		asteroid.pos.y -= 100;
	});

	sun.pos.y -= 100;
}

function moveDown() {
	planets.forEach(planet => {
		planet.pos.y += 100;
		planet.history.forEach(historyPoint => {
			historyPoint.y += 100;
		});
	});

	asteroids.forEach(asteroid => {
		asteroid.pos.y += 100;
	});

	sun.pos.y += 100;
}

function moveRight() {
	planets.forEach(planet => {
		planet.pos.x += 100;
		planet.history.forEach(historyPoint => {
			historyPoint.x += 100;
		});
	});

	asteroids.forEach(asteroid => {
		asteroid.pos.x += 100;
	});

	sun.pos.x += 100;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}