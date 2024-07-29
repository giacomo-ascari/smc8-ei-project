let p = undefined;

let ready = false;

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
        // audio spatialization
        if (p.waves != undefined) {
            updateListener(p.cameraX, p.cameraY);
        }
        //printAudioStatus(p.waves)
    }, 20);

    // chunk generation loop
    setInterval(() => {
        if (ready == true) {
            p.terrain.updateChunks(p.cameraX * width, p.cameraY * height);
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

    //orbitControl();

    // shift for visibility
    let offsetAdjY = -height / 10; 
    let offsetAdjZ = -height / 8;
    let xRotation =  30;
    translate(0, offsetAdjY, offsetAdjZ)
    rotateX(xRotation);

    // lighting
    background(50);
    ambientLight(40);
    directionalLight(255, 0, 20, createVector(0, -1, 0));
    
    // shift for camera
    // some global variables to keep updated
    // here things move according to the camera
    push();
    translate(p.cameraX * width, p.cameraY * height);   
    
    // chunks
    noStroke();
    ambientMaterial(255);

    for (let i = 0; i < p.terrain.chunks.length; i++) {
        let c = p.terrain.chunks[i];

        let terrainOffsetX = c.xCorner * c.spaceSize * c.scale;
        let terrainOffsetY = c.yCorner * c.spaceSize * c.scale;

        push();
        scale(1, 1, 1)
        translate(terrainOffsetX, terrainOffsetY, 0);
        model(c.getModel());
        pop();

    }

    // waves
    // material for waves
    noFill();
    stroke(255, 255, 0);
    // draw waves
    for (let i = 0; i < p.waves.length; i++) {
        let w = p.waves[i];
        for (let j = 0; j < w.data.length; j+=4) {
            push();
            scale(1, 1, 1)
            translate(
                w.data[j].x * width,
                w.data[j].y * height,
                w.data[j].z * p.amplitude);
            box(3, 3, 10);
            pop();
        }
    }

    // end of camera shift
    // now things will stay fixed
    pop();

    // plane for debug
    //noFill();
    //stroke(255, 255, 255);
    //plane(width, height)
    
    // draw the area of action of the hands
    noFill();
    stroke(200);
    line(-width/2, height/2, 0, width/2, height/2, 0);
    line(-width/2, -height/2, 0, width/2, -height/2, 0);
    line(-width/2, -height/2, 0, -width/2, height/2, 0);
    line(width/2, -height/2, 0, width/2, height/2, 0);

    // drawing the hands
    
    // draw the left hand
    if (p.leftHand.active) {
        let z = 75, r = 50;
        if (p.leftHand.isDragging) { z = 20; r = 45; }
        else if (p.leftHand.isPointing) { r = 10 }
        if (p.leftHand.isThumbingDown) { noFill(); stroke(255, 127, 0); }
        else { noFill(); stroke(255); }
        push();
        translate((0.5-p.leftHand.position.x) * width, (p.leftHand.position.y-0.5) * height, z);
        rotateX(90);
        sphere(r, 10, 10);
        pop();
    }

    // draw the right hand
    if (p.rightHand.active) {
        let z = 75, r = 50;
        if (p.rightHand.isDragging) { z = 20; r = 45; }
        else if (p.rightHand.isPointing) { r = 10 }
        if (p.rightHand.isThumbingDown) { noFill(); stroke(255, 127, 0); }
        else { noFill(); stroke(255); }
        push();
        translate((0.5-p.rightHand.position.x) * width, (p.rightHand.position.y-0.5) * height, z);
        rotateX(90);
        sphere(r, 10, 10);
        pop();
    }

    // color for the traces
    stroke(255, 255, 0);

    // draw the left hand traces
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

    // draw the right hand traces
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