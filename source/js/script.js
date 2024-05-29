let p = undefined;

let ready = false;

let cameraOffsetX;
let cameraOffsetY;

function onload() {
    
    p = new Project();

    // render loop
    // if all goes well, replaced by p5js
    //setInterval(() => { p.render(); }, 50);

    // logic loop
    setInterval(() => {
        // read mediaPipe output
        if (window.mediapipeResults) {
            p.update(window.mediapipeResults);
        }
    }, 20);

    // chunk generation loop
    setInterval(() => {
        if (ready == true) {
            p.terrain.updateChunks(cameraOffsetX, cameraOffsetY);
        }
    }, 1000);

    // tell p5.js to start drawing
    ready = true;
}

function onresize() {
    resizeCanvas(windowWidth, windowHeight);
}

// p5.js default invocation
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);
    noStroke();

}

// p5.js default invocation
function draw() {

    if (ready == false) { return; }

    orbitControl();

    background(0);
    ambientLight(50);
    
    noStroke();
    ambientMaterial(255);

    let offsetAdjY = height / 5;
    let offsetAdjZ = -50;
    let xRotation = 30;

    rotateX(xRotation);

    directionalLight(255, 0, 0, createVector(0, -1, 0));

    //box(30, 50, 50)
    //directionalLight(255, 0, 0, createVector(1, 0, 0));
    //directionalLight(0, 0, 255, createVector(-1, 0, 0));
    //pointLight(255, 0, 0, -width/2, 0, 0); // red on right
    //pointLight(0, 0, 255, width/2, 0, 0); // blue on left
    //pointLight(255, 255, 255, 0, 0, 200); // white from top
    
    // globabl variables
    cameraOffsetX = p.cameraX * width;
    cameraOffsetY = p.cameraY * height + offsetAdjY;

    //
    
    for (let i = 0; i < p.terrain.chunks.length; i++) {
        let c = p.terrain.chunks[i];

        let terrainOffsetX = c.xCorner * c.spaceSize * c.scale;
        let terrainOffsetY = c.yCorner * c.spaceSize * c.scale;

        push();
        scale(1, 1, 1)
        translate(
            terrainOffsetX + cameraOffsetX,
            terrainOffsetY + cameraOffsetY, offsetAdjZ);
        model(c.getModel());
        pop();

    }
    
    // material for both hands
    // and hands config
    noFill();
    stroke(255);
    
    // draw the left hand
    if (p.leftHand.active) {
        let z = 75, r = 50;
        if (p.leftHand.isDragging) { z = 0 }
        else if (p.leftHand.isPointing) { r = 10 }
        push();
        translate((0.5-p.leftHand.position.x) * width, (p.leftHand.position.y-0.5) * height, z);
        rotateX(90);
        sphere(r, 10, 10);
        pop();
    }

    // draw the right hand
    if (p.rightHand.active) {
        let z = 75, r = 50;
        if (p.rightHand.isDragging) { z = 0 }
        else if (p.rightHand.isPointing) { r = 10 }
        push();
        translate((0.5-p.rightHand.position.x) * width, (p.rightHand.position.y-0.5) * height, z);
        rotateX(90);
        sphere(r, 10, 10);
        pop();
    }

    // color for the traces
    stroke(255, 255, 0);

    // draw the left hand trace
    if (p.leftHandTrace.length > 1) {
        for (let i = 0; i < p.leftHandTrace.length - 1; i++) {
            push();
            let dx = (p.leftHandTrace[i].x - p.leftHandTrace[i+1].x) * width;
            let dy = (p.leftHandTrace[i].y - p.leftHandTrace[i+1].y) * height;
            let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let angle = -Math.atan2(dy, dx) * 180 / Math.PI;
            translate((0.5-p.leftHandTrace[i].x) * width + dx/2, (p.leftHandTrace[i].y-0.5) * height - dy/2, 0);
            rotateZ(angle);
            rotateX(90);
            plane(distance, p.amplitude * 1.3);
            pop();
        }
    }

    // draw the right hand trace
    if (p.rightHandTrace.length > 1) {
        for (let i = 0; i < p.rightHandTrace.length - 1; i++) {
            push();
            let dx = (p.rightHandTrace[i].x - p.rightHandTrace[i+1].x) * width;
            let dy = (p.rightHandTrace[i].y - p.rightHandTrace[i+1].y) * height;
            let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let angle = -Math.atan2(dy, dx) * 180 / Math.PI;
            translate((0.5-p.rightHandTrace[i].x) * width + dx/2, (p.rightHandTrace[i].y-0.5) * height - dy/2, 0);
            rotateZ(angle);
            rotateX(90);
            plane(distance, p.amplitude * 1.3);
            pop();
        }
    }
}