// https://joeiddon.github.io/projects/javascript/perlin.html
// https://en.wikipedia.org/wiki/Perlin_noise
// https://p5js.org/
// https://www.youtube.com/watch?v=kCIaHqb60Cw
// https://paulwheeler.us/articles/custom-3d-geometry-in-p5js/
// https://p5js.org/reference/#/p5.Geometry/computeNormals


class Chunk {

    constructor(spaceSize, frequency, xCorner, yCorner, scale, amplitude) {

        // the 'space' is just the visualization space
        // the space needs a +1 for visualization
        this.spaceSize = spaceSize; // integer!!!
        this.space = genSquareMatrix(spaceSize+2); // points in space

        this.frequency = frequency; // integer!!!

        //relative position of the space (index of chunk)
        this.xCorner = xCorner;
        this.yCorner = yCorner;

        // scale of the chunk
        this.scale = scale;

        this.amplitude = amplitude;

        // model for p5.js rendering
        this.model = undefined;
    }

    build() {

        iterate2d(this.spaceSize+2, this.spaceSize+2, (i, j, onBorder) => {

            let x = (this.xCorner * this.spaceSize + i) / this.frequency;
            let y = (this.yCorner * this.spaceSize + j) / this.frequency;
            this.space[i][j] = this.amplitude * layeredperlin(x, y);
            if (i == this.spaceSize+1 || j == this.spaceSize+1) {
                this.space[i][j] -= 0.5;
            }
        })

    }


    getModel() {
        if (this.model == undefined) {
            beginGeometry();
            scale(this.scale, this.scale, 1)
            for (let x = 0; x < this.spaceSize-1+2; x++) {
                beginShape(TRIANGLE_STRIP);
                for (let y = 0; y < this.spaceSize+2; y++) {
                    vertex(x, y, this.space[x][y]);
                    vertex((x+1), y, this.space[x+1][y]);
                }
                endShape();
            }
            this.model = endGeometry();
            //this.model.computeFaces();
            this.model.computeNormals(SMOOTH, {roundToPrecision: 2}); // SMOOTH
        }
        return this.model
    }
}