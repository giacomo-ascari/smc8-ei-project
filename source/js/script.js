let p = undefined;

function onload() {
    
    const canvas = document.getElementById("terrainCanvas");
    const ctx = canvas.getContext("2d");

    p = new Project(canvas, ctx);

    p.resize();

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
}

function onresize() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}
  
function draw() {
    background(0);
    
    normalMaterial();
    push();
    translate(0, -100, 0);
    rotateZ(frameCount * 0.01);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    plane(70);
    pop();
}