// utility to iterate easily on matrixes
// it passes ito the callback ndex 1, index 2 and a condition
// representing if the current indexed item sits on a border
function iterate2d(imax, jmax, callback) {
    for (let i = 0; i < imax; i++) {
        for (let j = 0; j < jmax; j++) {
            let onBorder = false
            if (i == 0 || j == 0 || i == imax-1 || j == jmax-1) {
                onBorder = true
            }
            callback(i, j, onBorder)
        }
    }
}

// easily generates a matrix of defined size
// 0 is the default value
function genMatrix(xSize, ySize) {
    let mat = new Array(xSize);
    for (let x = 0; x < xSize; x++) {
        mat[x] = new Array(ySize)
        for (let y = 0; y < ySize; y++) {
            mat[x][y] = 0;                
        }
    }
    return mat;
}

// easily generates a square matrix of defined size
// 0 is the default value
function genSquareMatrix(size) {
    let mat = new Array(size);
    for (let x = 0; x < size; x++) {
        mat[x] = new Array(size)
        for (let y = 0; y < size; y++) {
            mat[x][y] = 0;                
        }
    }
    return mat;
}

// pseudo random function
// hashing probably?? silly table??
const rsSize = 1024;
let randomSpace = undefined;

function pseudoRandom(a, b) {
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

pseudoRandom(0,0);