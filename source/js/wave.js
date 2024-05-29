class Wave {

    constructor(points, resolution, cameraX, cameraY) {
        
        // model for p5.js rendering
        this.model = undefined;

        let wavePoints = [];

        // it also resamples to the resolution
        for (let i = 0; i < points.length - 1; i++) {
            let dx = (points[i].x - points[i+1].x) * width;
            let dy = (points[i].y - points[i+1].y) * height;
            let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let angle = -Math.atan2(dy, dx) * 180 / Math.PI;

            let step = 1 / this.resolution;
            let samplesInSegment = distance / step;

            let x, y, z;
            for (let j = 0; j < samplesInSegment; j++) {
                let _x = 0 + points[i].x +  dx * j * step;
                let _y = 0 + points[i].y +  dy * j * step;
            }

        }
    }

    getModel() {
        /*if (this.model == undefined) {
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
        }*/
        return this.model
    }
}