// maybe class chunk will be needed

// https://joeiddon.github.io/projects/javascript/perlin.html
// https://en.wikipedia.org/wiki/Perlin_noise
// https://p5js.org/


class Chunk {

    constructor(xSize, ySize) {
        this.xSize = xSize;
        this.ySize = ySize;
        
        // create cell space
        this.cells = genMatrix(xSize, ySize);
        this.colors = genMatrix(xSize, ySize);
        iterate2d(xSize, ySize, (x, y, onBorder) => {
            this.cells[x][y] = Math.cos(Math.random() * Math.PI * 2);
            this.colors[x][y] = RGBtoString({r: this.cells[x][y] * 255, g: 50, b: 100});
        })

    }

    updateColors() {
        iterate2d(this.xSize, this.ySize, (x, y, onBorder) => {
            this.colors[x][y] = RGBtoString({r: this.cells[x][y] * 255, g: 50, b: 100});
        })
    }
}

class Terrain {

    constructor(xSize, ySize, zoom) {
        // general info
        this.xSize = xSize;
        this.ySize = ySize;
        this.zoom = zoom;
        // create cell space with border
        this.chunk = new Chunk(xSize, ySize);
    }

}