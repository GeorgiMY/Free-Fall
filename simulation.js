const G = 1;

let earth;
let planets;
let stars;
let particles;

let bg;
let bgs;
let spaceImg;

let checkBoxArrow;
let checkBoxAttraction;
let checkBoxTracing;
let checkboxDestroying;

let s2p;
let s2s;
let p2p;

let checkboxS2S;
let checkboxS2P;
let checkboxP2P;

let arrow;
let attraction;
let tracing;
let destroy;

let spawn;
let planetsButton;
let starsButton;

let ecc;

function preload() {
	spaceImg = loadImage('assets/space.jpg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	attraction = true;
	tracing = false;
	arrow = true;
	destroy = true;
	spawn = true;

	bg = "gray";

	checkBoxAttraction = document.getElementById("attraction");
	checkBoxTracing = document.getElementById("tracing");
	checkBoxArrow = document.getElementById("arrow");
	checkboxDestroying = document.getElementById("destroy");

	checkboxS2S = document.getElementById("s2s");
	checkboxS2P = document.getElementById("s2p");
	checkboxP2P = document.getElementById("p2p");

	s2p = true;
	s2s = false;
	p2p = false;

	planets = [];
	stars = [];
	particles = [];

	planetsButton = document.getElementById("planet");
	starsButton = document.getElementById("star");
}

function draw() {
	translate(width / 2, height / 2);
	background(bg);
	scale(scaleAmount);

	if (attraction) {
		// Stars attract planets
		if (s2p) {
			for (let planet of planets) {
				for (let star of stars) {
					star.attract(planet);
				}
			}
		}

		// Planets attract each other
		if (p2p) {
			for(let planet of planets) {
				for (let other of planets) {
					if (planet !== other) {
						planet.attract(other);
					}
				}
			}
		}

		// Stars attact each other
		if(s2s) {
			for (let star of stars) {
				for (let other of stars) {
					if (star !== other) {
						star.attract(other);
					}
				}
			}
		}
	}

	// Update and draw each Particle
	particles.forEach(particle => {
		particle.update();
		particle.draw();

		if(Date.now() - particle.timer > 3000) {
			let indexOfParticle = particles.indexOf(particle);
			particles.splice(indexOfParticle, 1);
		}
	});

	// Update and draw each planet
	planets.forEach(planet => {
		planet.update();
		planet.draw();
		
		if (tracing) {
			planet.drawTrace();
		}
		if(arrow) {
			planet.drawArrow();
		}
	});

	// Update and draw each star
	stars.forEach(star => {
		star.update();
		star.draw();
	
		if(arrow) {
			star.drawArrow();
		}
	});

	if (destroy) {
		for(let planet of planets) {
			// Planets destroy each other
			for (let other of planets) {
				if (planet !== other) {
						let distance = dist(planet.pos.x, planet.pos.y, other.pos.x, other.pos.y);
						if (distance <= planet.r + other.r) {
							let rand = Math.floor(Math.random() * 50) + 30;
							for (let i = 0; i < rand; i++) {
								particles.push(new Particle(planet.pos.x, planet.pos.y, planet.color, other.color));
								particles.push(new Particle(other.pos.x, other.pos.y, other.color, planet.color));
							}

							let indexOfPlanet = planets.indexOf(planet);
							planets.splice(indexOfPlanet, 1);
							let indexOfOther = planets.indexOf(other);
							planets.splice(indexOfOther, 1);
					}
				}
			}

			// Planets and Stars destroy each other
			for (let star of stars) {
				let distance = dist(planet.pos.x, planet.pos.y, star.pos.x, star.pos.y);
				if (distance <= planet.r + star.r) {
					let rand = Math.floor(Math.random() * 50) + 30;
					for (let i = 0; i < rand; i++) {
						particles.push(new Particle(planet.pos.x + planet.r, planet.pos.y + planet.r, planet.color, star.color));
					}

					let index = planets.indexOf(planet);
					planets.splice(index, 1);
				}
			}
		}

		// Stars destroy each other
		for (let star of stars) {
			for (let other of stars) {
				if (star !== other) {
					if (destroy) {
						let distance = dist(star.pos.x, star.pos.y, other.pos.x, other.pos.y);
						if (distance <= star.r + other.r) {
							let rand = Math.floor(Math.random() * 50) + 30;
							for (let i = 0; i < rand; i++) {
								particles.push(new Particle(star.pos.x, star.pos.y, star.color, other.color));
								particles.push(new Particle(other.pos.x, other.pos.y, other.color, star.color));
							}

							let indexOfStar = stars.indexOf(star);
							stars.splice(indexOfStar, 1);
							let indexOfOther = stars.indexOf(other);
							stars.splice(indexOfOther, 1);
						}
					}
				}
			}
		}
	}
}

function mouseClicked() {
	if (spawn) {
		let pos = createVector(mouseX - width/2, mouseY - height/2).div(scaleAmount);
		let vel = createVector(0, 0);
		let radios = document.getElementsByName("everyObject");
		for (let i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				if (allObjects[i] instanceof Planet) {
					planets.push(new Planet(pos.x, pos.y, vel.x, vel.y, allObjects[i].mass, allObjects[i].r, allObjects[i].color));
				}
				else if (allObjects[i] instanceof Star){
					stars.push(new Star(pos.x, pos.y, vel.x, vel.y, allObjects[i].mass, allObjects[i].r, allObjects[i].color));
				}
			}
		}
	}
}

function toggleCreateObjectScreen() {
	let x = document.getElementById("container");
	if(x.style.display === "none") {
		x.style.display = "flex";
	}
	else {
		x.style.display = "none";
	}
}

function changeBackground() {
	bgs = document.getElementsByName("fonts");

	for (let i = 0; i < bgs.length; i++) {
		if (bgs[i].checked) {
			if (bgs[i].value === "space") {
				bg = spaceImg;
			}
			else {
				bg = bgs[i].value;
			}
		}
	}
}

function destroyObject() {
	if (checkboxDestroying.checked == true) {
		destroy = true;
	} else {
		destroy = false;
	}
}

function attract() {
	if (checkBoxAttraction.checked == true) {
		attraction = false;
	} else {
		attraction = true;
	}
}

function arrowShow() {
	if (checkBoxArrow.checked == true) {
		arrow = true;
	}
	else {
		arrow = false;
	}
}

function trace() {
	if (checkBoxTracing.checked == true) {
		tracing = true;
	} else {
		tracing = false;
	}
}

function orbiting() {
	for (let i = 0; i < planets.length; i++) {
		// planets[i].startOrbiting(stars[0]);
		planets[i].startEllipticOrbit(stars[0]);
	}
}

function s2sAttraction() {
	if (checkboxS2S.checked == true) {
		s2s = true;
	} else {
		s2s = false;
	}
}
function s2pAttraction() {
	if (checkboxS2P.checked == true) {
		s2p = true;
	} else {
		s2p = false;
	}
}
function p2pAttraction() {
	if (checkboxP2P.checked == true) {
		p2p = true;
	} else {
		p2p = false;
	}
}

function randomizingPosition() {
	for (let i = 0; i < planets.length; i++) {
		planets[i].randomizeDir(stars[0]);
	}
}

function disableSpawn() {
	spawn = false;
}

function enableSpawn() {
	spawn = true;
}

function reset() {
	planets = [];
	stars = [];
	particles = [];
}

function youSure() {
	return "Are you sure you want to leave this page?";
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}