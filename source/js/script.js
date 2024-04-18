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
    }, 20);

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

    if (ready == false) { console.log("not ready yet"); return; }

    orbitControl();

    background(10);
    ambientLight(100);
    //directionalLight(255, 0, 0, createVector(0, 1, 0));
    //pointLight(255, 0, 0, -width/2, 0, 0);
    //pointLight(0, 0, 255, width/2, 0, 0);

    //rotateX(20);
    //translate(0, -height/6, 0);
    
    //normalMaterial();
    noFill();stroke(150);
    //ambientMaterial(250);

    let planarScale = 30;
    let zScale = 150;
    let zOffset = -50;

    for (let i = 0; i < p.terrain.chunks.length; i++) {
        let c = p.terrain.chunks[i];

        let xOffset = c.xCorner * c.spaceSize;
        let yOffset = c.yCorner * c.spaceSize;

        push();
        scale(planarScale, planarScale, zScale)
        translate(xOffset, yOffset, zOffset/zScale);
        model(c.getModel());
        pop();

    }

    /*push();
    for (let i = 0; i < p.terrain.chunks.length; i++) {
        let c = p.terrain.chunks[i];
        let xOffset = planarScale * c.xCorner * c.spaceSize;
        let yOffset = planarScale * c.yCorner * c.spaceSize;
        for (let x = 0; x < c.spaceSize-1+1; x++) {
            beginShape(TRIANGLE_STRIP);
            for (let y = 0; y < c.spaceSize+1; y++) {
                vertex(
                    xOffset + x*planarScale,
                    yOffset + y*planarScale,
                    zOffset + c.space[x][y]*zScale);
                vertex(
                    xOffset + (x+1)*planarScale,
                    yOffset + y*planarScale,
                    zOffset + c.space[x+1][y]*zScale);
            }
            endShape();
        }
    }
    pop();*/
    
    // normal material for both hands
    // and hands config
    //normalMaterial();
    //fill(250, 0, 0);
    ambientMaterial(255);
    //specularMaterial(250);
    //noFill();stroke(255);

    
    // draw the left hand
    if (p.leftHand.active) {
        let z = 50, r = 50, h = 20;
        if (p.leftHand.isDragging) z = 10;
        else if (p.leftHand.isPointing) { r = 10; h = 100 }
        push();
        translate((0.5-p.leftHand.position.x) * width, (p.leftHand.position.y-0.5) * height, z);
        rotateX(90);
        cylinder(r, h);
        pop();
    }

    // draw the right hand
    if (p.rightHand.active) {
        let z = 50, r = 50, h = 20;
        if (p.rightHand.isDragging) z = 10;
        else if (p.rightHand.isPointing) { r = 10; h = 100 }
        push();
        translate((0.5-p.rightHand.position.x) * width, (p.rightHand.position.y-0.5) * height, z);
        rotateX(90);
        cylinder(r, h);
        pop();
    }
}