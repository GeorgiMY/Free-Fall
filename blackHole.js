const c = 3;
const G = 1;
const dt = 0.5;

let blackHole;
let particles;
let photonId;

let moving;
let checkBoxMovement;

let scaleAmount;
let scaleFactor;
let scaling;

let start, end;

function setup() {
	createCanvas(windowWidth, windowHeight);

	scaleAmount = 1;
	scaleFactor = 0.1;
	scaling = true;

	moving = true;
	checkBoxMovement = document.getElementById("movement");

    particles = [];
	blackHole = new Blackhole(0, 0, 500);
	ellipseMode(RADIUS);

	start = windowHeight/2;
	end = -windowHeight/2;

	for (let y = end; y < start; y += 10) {
		particles.push(new Photon(windowWidth/2, -y));
	}

    photonId = document.getElementById("photonCount");
    photonId.innerHTML = "Брой фотони: " + particles.length;
}

function draw() {
	translate(width/2, height/2);
	scale(scaleAmount);
	background("gray");
	blackHole.draw();
	
	particles.forEach(particle => {
		if(moving) {
			blackHole.attract(particle);
			particle.update();
		}
		particle.draw();
		particle.drawTrace();
	});
}

function movement() {
	if (checkBoxMovement.checked == true) {
		moving = false;
	} else {
		moving = true;
	}
}

function disableScaling() {
	scaling = false;
}

function enableScaling() {
	scaling = true;
}

function mouseWheel(event) {
	if (scaling) {
		if (event.deltaY > 0) {
			scaleAmount -= scaleFactor;
		} else {
			  scaleAmount += scaleFactor;
		}
	}
	
	// limit the scale amount to prevent zooming too far in/out
	scaleAmount = constrain(scaleAmount, 0.1, 1000.0);
}

function windowResized() {
    setup();
}