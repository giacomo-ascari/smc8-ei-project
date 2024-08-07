// pseudo random function
// hashing probably?? silly table??
const rsSize = 1024;

let randomSpace = undefined;

function pseudoRandom(a, b) {
    a = a * 7.2 + 2.4;
    b = b * 3 + 5;
    //return a * 17.1 + b * 3.1;
    if (randomSpace == undefined) {
        randomSpace = genMatrix(rsSize, rsSize);
        iterate2d(rsSize, rsSize, (i, j)=> {
            randomSpace[i][j] = Math.random();
        })
    }
    let aAdj = Math.floor(a) % rsSize;
    let bAdj = Math.floor(b) % rsSize;
    if (aAdj < 0) aAdj += rsSize;
    if (bAdj < 0) bAdj += rsSize;
    return randomSpace[aAdj][bAdj]
}

// force init because of lazyness
pseudoRandom(0,0);

// perlin noise implementation
// lets hope that it works this time god damn it

function dotGridGradient(xGrad, yGrad, x, y) {

    // get the gradients from the pseudo random function
    let phi = pseudoRandom(xGrad, yGrad) * 2 * Math.PI;
    let gradient = {x: Math.cos(phi), y: Math.sin(phi)};
    
    let dx = x - xGrad;
    let dy = y - yGrad;
    // compute the dot-product
    return (dx*gradient.x + dy*gradient.y);
}


function interpolate(a0, a1, w) {
    //return (a1 - a0) * w + a0;
    return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
    //return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
}

function perlin(x, y) {

    // perlin noise generation
    // x and y iterate on the point space
    // x0, y0, x1, y1 belong to the (smaller) gradient space

    let x0 = Math.floor(x);
    let y0 = Math.floor(y);
    let x1 = x0 + 1;
    let y1 = y0 + 1;

    let sx = x - x0;
    let sy = y - y0;

    // dot product between its gradient vector and
    // the offset vector to the candidate point
    let n0 = this.dotGridGradient(x0, y0, x, y);
    let n1 = this.dotGridGradient(x1, y0, x, y);
    let n2 = this.dotGridGradient(x0, y1, x, y);
    let n3 = this.dotGridGradient(x1, y1, x, y);

    // interpolation
    let ix0 = this.interpolate(n0, n1, sx);        
    let ix1 = this.interpolate(n2, n3, sx);
    let value = this.interpolate(ix0, ix1, sy);

    if (Math.abs(value) < 0.707106781) console.error("PERLIN BORKE")
    // the value should be at max 1/sqrt(2)

    return value;
}


function layeredperlin(x, y) {
    // cool one, with octaves
    let z = 0;
    z += perlin(x, y);
    z += 0.5 * perlin(x*2, y*2);
    z += 0.25 * perlin(x*4, y*4);
    z += 0.125 * perlin(x*8, y*8);
    z += (0.0625 + 0.002) * perlin(x*16, y*16);
    z += (0.03125 + 0.001) * perlin(x*32, y*32);
    z += - Math.pow(perlin(x/2, y/2), 2);
    return z;
}