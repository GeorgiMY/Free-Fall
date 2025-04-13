class Planet {
    constructor(x, y, vx, vy, m, r, color) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.acc = createVector(0, 0);

        this.mass = m;
        this.r = r;

        this.color = color;
        this.stroke = true;
        this.history = [];
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    attract(secondBody) {
        let r = dist(this.pos.x, this.pos.y, secondBody.pos.x, secondBody.pos.y);
		let f = this.pos.copy().sub(secondBody.pos);
		f.setMag((G * this.mass * secondBody.mass) / (r * r));
		
		secondBody.applyForce(f);
    }

    draw() {
        fill(this.color);
        if (this.stroke) {
            stroke(0);
        }
        else {
            noStroke();
        }
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    startOrbiting(star) {
        this.vel.rotate(HALF_PI);
        let distance = dist(star.pos.x, star.pos.y, this.pos.x, this.pos.y);
        this.vel.setMag(sqrt((G*star.mass)/distance));
    }

    startEllipticOrbit(star) {
        let eccentricity = Number(document.getElementById("ecc").value);
        let starMass = star.mass;
        let distance = dist(star.pos.x, star.pos.y, this.pos.x, this.pos.y);
        let semiMajorAxis = distance / (1 - eccentricity);
        this.vel.rotate(HALF_PI);
        this.vel.setMag(Math.sqrt(G*starMass*(2/distance - 1/semiMajorAxis)));
    }
    // randomizeDir() {
    //     let planetVel = this.vel.copy();
    //     planetVel.rotate(random(0, TWO_PI));
    //     this.vel.setMag(planetVel);
    // }

    drawArrow() {
        if(this.vel.x != 0 && this.vel.y != 0) {
            let v0 = createVector(this.pos.x, this.pos.y - this.r - 10);
            let v1 = createVector(this.vel.x * 20, this.vel.y * 20);
            let myColor = 'red';
    
            push();
            stroke(myColor);
            strokeWeight(3);
            fill(myColor);
            translate(v0.x, v0.y);
            line(0, 0, v1.x, v1.y);
            rotate(v1.heading());
            let arrowSize = 7;
            translate(v1.mag() - arrowSize, 0);
            triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            pop();
        }
    }

    drawTrace() {
        this.history.push(this.pos.copy());
        
        if (this.history.length > 20000) {
            this.history.splice(0, 1);
        }

        // Draw points which traces the planets path
        strokeWeight(1);
        noFill();
        beginShape();

        for(let v of this.history) {
            vertex(v.x, v.y);
        }

        endShape();
    }
}


class Star {
    constructor(x, y, vx, vy, m, r, color) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.acc = createVector(0, 0);

        this.mass = m;
        this.r = r;
        
        this.color = color;
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    attract(secondBody) {
        let r = dist(this.pos.x, this.pos.y, secondBody.pos.x, secondBody.pos.y);
		let f = this.pos.copy().sub(secondBody.pos);
		f.setMag((G * this.mass * secondBody.mass) / (r * r));
		
		secondBody.applyForce(f);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    draw() {
        fill(this.color);
        stroke(0);
        // noStroke();
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    drawArrow() {
        if(this.vel.x != 0 && this.vel.y != 0) {
            let v0 = createVector(this.pos.x, this.pos.y - this.r - 10);
            let v1 = createVector(this.vel.x * 20, this.vel.y * 20);
            let myColor = 'red';
    
            push();
            stroke(myColor);
            strokeWeight(3);
            fill(myColor);
            translate(v0.x, v0.y);
            line(0, 0, v1.x, v1.y);
            rotate(v1.heading());
            let arrowSize = 7;
            translate(v1.mag() - arrowSize, 0);
            triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
            pop();
        }
    }
}


class Blackhole {
    constructor(x, y, m) {
        this.pos = createVector(x, y);
        this.mass = m;
        this.rs = 2 * G * this.mass / (c * c);
    }

    attract(photon) {
        const force = p5.Vector.sub(this.pos, photon.pos);
        const theta = force.heading();
        const r = force.mag();
        const fg = G * this.mass / (r * r);
        let deltaTheta = -fg * (dt / c) * sin(photon.theta - theta);
        deltaTheta /= abs(1.0 - 2.0 * G * this.mass / (r * c * c));
        photon.theta += deltaTheta;
        photon.vel = p5.Vector.fromAngle(photon.theta);
        photon.vel.setMag(c);

        if(r <= this.rs + 0.5) {
            photon.stop();
        }
    }

    draw() {
        fill(0);
        stroke(0);
        ellipseMode(RADIUS);
        ellipse(this.pos.x, this.pos.y, this.rs);

        noFill();
        stroke(255, 255, 0);
        strokeWeight(8);
        ellipse(this.pos.x, this.pos.y, this.rs * 1.5);
    }
}


class Photon {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(-c, 0);
        
        this.history = [];
        this.stopped = false;
        this.theta = PI;
    }

    update() {
        if(!this.stopped) {
            if (frameCount % 5 == 0) {
                this.history.push(this.pos.copy());
            }
            const deltaV = this.vel.copy();
            deltaV.mult(dt);

            this.pos.add(deltaV);
        }

        // if (this.history.length > 8000) {
        //     this.history.splice(0, 1);
        // }
    }

    stop() {
        this.stopped = true;
    }

    draw() {
        strokeWeight(4);
        stroke(255, 0, 0);
        point(this.pos.x, this.pos.y);
    }

    drawTrace() {
        strokeWeight(2);
        noFill();
        stroke(255, 0, 0);
        beginShape();

        for(let v of this.history) {
            vertex(v.x, v.y);
        }

        endShape();
    }
}


class Asteroid {
    constructor(x, y, vx, vy, m, r) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.acc = createVector(0, 0);

        this.mass = m;
        this.r = r;
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    attract(secondBody) {
        let r = dist(this.pos.x, this.pos.y, secondBody.pos.x, secondBody.pos.y);
		let f = this.pos.copy().sub(secondBody.pos);
		f.setMag((G * this.mass * secondBody.mass) / (r * r));
		
		secondBody.applyForce(f);
    }

    draw() {
        fill("black");
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }
}


class Particle {
    constructor (x, y, obj1Color, obj2Color) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(3, 10));

        this.colors = [obj1Color, obj2Color];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.stroke = false;

        this.r = random(5, 10);
        this.timer = Date.now();
    }

    draw() {
        fill(this.color);
        if (this.stroke) {
            stroke(0);
        }
        else {
            noStroke();
        }

        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    update() {
        this.pos.add(this.vel);
    }
}


class Ball {
    constructor(x, y, a, m, r) {
        this.pos = createVector(x, y);
        this.r = r;

        this.m = m;
        this.a = a;
    }

    // t = sqrt((2 * h) / g) Dropped vertically with no air resistance; t is time; h is height; g is gravity accelaration

    draw() {
        fill(0, 255, 255);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    update() {
    }
}