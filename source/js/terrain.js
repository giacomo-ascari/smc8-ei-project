// https://joeiddon.github.io/projects/javascript/perlin.html
// https://en.wikipedia.org/wiki/Perlin_noise
// https://p5js.org/
// https://www.youtube.com/watch?v=kCIaHqb60Cw
// https://paulwheeler.us/articles/custom-3d-geometry-in-p5js/
// https://p5js.org/reference/#/p5.Geometry/computeNormals


class Chunk {

    constructor(spaceSize, resolution, xCorner, yCorner) {

        // the 'space' is just the visualization space
        // the space needs a +1 for visualization
        this.spaceSize = spaceSize; // integer!!!
        this.space = genSquareMatrix(spaceSize+1); // points in space

        // resolution means how many gradient points per integer cell in space
        this.resolution = resolution; // integer!!!

        //relative position of the space (index of chunk)
        this.xCorner = xCorner;
        this.yCorner = yCorner;

        // model for p5.js rendering
        this.model = undefined;
    }

    build() {

        iterate2d(this.spaceSize+1, this.spaceSize+1, (i, j, onBorder) => {

            this.space[i][j] += this.perlin(
                i / this.spaceSize * this.resolution,
                j / this.spaceSize * this.resolution
            );
            //this.space[x][y] += 0.5 * this.perlin(x, y, 2);
            //this.space[x][y] += 0.25 * this.perlin(x, y, 4);
        })

    }

    perlin(x, y) {

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
        let ix1 = this.interpolate(n2, n3, sy);
        let value = this.interpolate(ix0, ix1, sy);

        return value;
    }

    dotGridGradient(xGrad, yGrad, x, y, scaling) {

        // get the gradients from the pseudo random function
        let phi = pseudoRandom(
            xGrad + (this.xCorner + x) * this.spaceSize / this.resolution,
            yGrad + (this.yCorner + y) * this.spaceSize / this.resolution
            ) * 2 * Math.PI;
        let gradient = {x: Math.cos(phi), y: Math.sin(phi)};
        let dx = x - xGrad;
        let dy = y - yGrad;
        // compute the dot-product
        return (dx*gradient.x + dy*gradient.y);
    }


    interpolate(a0, a1, w) {
        //return (a1 - a0) * w + a0;
        return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
        // return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
    }


    getModel() {
        if (this.model == undefined) {
            beginGeometry();
            for (let x = 0; x < this.spaceSize-1+1; x++) {
                beginShape(TRIANGLE_STRIP);
                for (let y = 0; y < this.spaceSize+1; y++) {
                    vertex(x, y, this.space[x][y]);
                    vertex((x+1), y, this.space[x+1][y]);
                }
                endShape();
            }
            this.model = endGeometry();
            //this.model.computeFaces();
            this.model.computeNormals(); // SMOOTH
        }
        return this.model
    }
}

class Terrain {

    constructor() {
        this.chunks = [];
        this.chunkSpaceSize = 32;
        this.chunkResolution = 24;
        this.xRadius = 2;
        this.yRadius = 1;

        this.xRenderCenter = 0;
        this.yRenderCenter = 0;

        for (let i = this.xRenderCenter-this.xRadius; i < this.xRenderCenter+this.xRadius; i++) {
            for (let j = this.yRenderCenter-this.yRadius; j < this.yRenderCenter+this.yRadius; j++) {
                let chunk = new Chunk(this.chunkSpaceSize, this.chunkResolution, i, j);
                chunk.build();
                this.chunks.push(chunk);
            }
        }
        
    }

}