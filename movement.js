let scaleAmount = 1;
let scaleFactor = 0.05;

function mouseWheel(event) {
    if (spawn) {
        if (event.deltaY > 0) {
            scaleAmount -= scaleFactor;
        } else {
            scaleAmount += scaleFactor;
        }
    }

    // limit the scale amount to prevent zooming too far in/out
    scaleAmount = constrain(scaleAmount, 0.1, 10.0);
}

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowLeft") {
        moveLeft()
    }
    else if (event.key == "ArrowUp") {
        moveUp();
    }
    else if (event.key == "ArrowDown") {
        moveDown();
    }
    else if (event.key == "ArrowRight") {
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

    stars.forEach(star => {
        star.pos.x -= 100;
    })

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

    stars.forEach(star => {
        star.pos.y -= 100;
    })

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

    stars.forEach(star => {
        star.pos.y += 100;
    })

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

    stars.forEach(star => {
        star.pos.x += 100;
    })

    asteroids.forEach(asteroid => {
        asteroid.pos.x += 100;
    });

    sun.pos.x += 100;
}
