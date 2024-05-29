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
        sphere(r, 10, 10);
        pop();
    }

    if (p.rightHandTrace.length > 0) {
        console.log("aaa")
        for (let i = 0; i < p.rightHandTrace.length; i++) {
            push();
            translate((0.5-p.rightHandTrace[i].x) * width, (p.rightHandTrace[i].y-0.5) * height, 0);
            sphere(10, 10, 10);
            pop();
        }
    }
}