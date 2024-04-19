// https://joeiddon.github.io/projects/javascript/perlin.html
// https://en.wikipedia.org/wiki/Perlin_noise
// https://p5js.org/
// https://www.youtube.com/watch?v=kCIaHqb60Cw
// https://paulwheeler.us/articles/custom-3d-geometry-in-p5js/
// https://p5js.org/reference/#/p5.Geometry/computeNormals


class Chunk {

    constructor(spaceSize, frequency, xCorner, yCorner) {

        // the 'space' is just the visualization space
        // the space needs a +1 for visualization
        this.spaceSize = spaceSize; // integer!!!
        this.space = genSquareMatrix(spaceSize+1); // points in space

        // frequency means how many gradient points per integer cell in space
        this.frequency = frequency; // integer!!!

        //relative position of the space (index of chunk)
        this.xCorner = xCorner;
        this.yCorner = yCorner;

        // model for p5.js rendering
        this.model = undefined;
    }

    build() {

        iterate2d(this.spaceSize+1, this.spaceSize+1, (i, j, onBorder) => {

            let x = (this.xCorner * this.frequency + i) / this.spaceSize;
            let y = (this.yCorner * this.frequency + j) / this.spaceSize;
            this.space[i][j] += perlin(x, y);
            //this.space[x][y] += 0.5 * this.perlin(x, y, 2);
            //this.space[x][y] += 0.25 * this.perlin(x, y, 4);
        })

    }


    getModel() {
        if (this.model == undefined) {
            beginGeometry();
            for (let x = 0; x < this.spaceSize-1; x++) {
                beginShape(TRIANGLE_STRIP);
                for (let y = 0; y < this.spaceSize; y++) {
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