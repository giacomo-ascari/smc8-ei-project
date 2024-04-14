let p = undefined;

function onload() {
    
    const canvas = document.getElementById("terrainCanvas");
    const ctx = canvas.getContext("2d");

    p = new Project(canvas, ctx);

    p.resize();

    // render loop
    setInterval(() => {
        p.render();
    }, 50);

    // logic loop
    setInterval(() => {
        // read mediaPipe output
        if (window.mediapipeResults) {
            p.update(window.mediapipeResults);
        }
    }, 20);
}

function onresize() {
    if (p) {
        p.resize();
    }
}