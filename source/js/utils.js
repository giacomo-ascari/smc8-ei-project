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

// calculate euclidian distance between two points
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// linear interpolation of two points
function interpolate2d(a, b, val) {
    return {
        x: a.x * (1 - val) + b.x * val,
        y: a.y * (1 - val) + b.y * val
    }
}

// linear interpolation of two points
function interpolate1d(a, b, val) {
    return a * (1 - val) + b * val;
}