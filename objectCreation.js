let allObjects = [];

function createObject() {
    let planet = document.getElementById("planet").checked;
    let star = document.getElementById("star").checked;
    let mass = Number(document.getElementById("mass").value);
    let radius = Number(document.getElementById("radius").value);
    let color = document.getElementById("colors").value;
    let node;
    // If planet is not checked OR star is not checked AND mass is not set
    if (!planet && !star || mass <= 0 || isNaN(mass)) {
        window.location.href = "simulation.html#popup1";
    }
    else {
        if (planet) {
            if (color === "normal") {
                color = "aqua";
            }
            allObjects.push(new Planet(undefined, undefined, 0, 0, mass, radius, color));
            node = document.createTextNode("PLANET");
        }
        else if (star) {
            if (color === "normal") {
                color = "yellow";
            }
            node = document.createTextNode("STAR");
            allObjects.push(new Star(undefined, undefined, 0, 0, mass, radius, color));
        }
        // Creating a li element
        let li = document.createElement("li");
        // Create the elements id which is li followed by it's
        let liId = "li" + String(allObjects.length);
        let labelId = "label" + String(allObjects.length);
        let objId = "object" + String(allObjects.length);

        li.setAttribute("id", liId);
        let elements = document.getElementById("radioObjects");
        elements.appendChild(li);

        let cbs = document.getElementById(liId);
        let cb = document.createElement("input");
        cb.setAttribute("type", "radio");
        cb.setAttribute("name", "everyObject");
        cb.setAttribute("id", objId);
        cbs.appendChild(cb);

        let label = document.createElement("label");
        label.setAttribute("for", objId);
        label.setAttribute("class", "labelCustom");
        label.setAttribute("id", labelId);
        cbs.appendChild(label);

        let labels = document.getElementById(labelId);
        let div = document.createElement("div");
        div.setAttribute("style", "display:inline-block; background:" + color + "; width:100%; height:100%; border-radius:50%; text-align: center;");
        div.appendChild(node);
        labels.appendChild(div);
        toggleCreateObjectScreen();
    }

}
