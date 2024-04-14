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

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
 * 0 <= h, s, v <= 1
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
 * 0 <= r, g, b <= 255
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}


function RGBtoString(obj) {
    r = Math.floor(obj.r).toString(16)
    g = Math.floor(obj.g).toString(16)
    b = Math.floor(obj.b).toString(16)
    if (r.length == 1) r = "0" + r
    if (g.length == 1) g = "0" + g
    if (b.length == 1) b = "0" + b
    return `#${r}${g}${b}`
}