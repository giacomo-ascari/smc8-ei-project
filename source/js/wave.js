class Wave {

    constructor(points, cameraX, cameraY, scale) {
        
        // the input points are an array of {x:, y:}

        this.cameraX = cameraX;
        this.cameraY = cameraY;


        // model for p5.js rendering
        this.model = undefined;

        // adjust coordinates
        // add distance (current to next, both absolute and relative)
        // from (x,y) points to (x,y,dd,d)
        let totalD = 0;
        let deltaD = 0;
        for (let i = 0; i < points.length; i++) {
            let inext = (i + 1) % points.length;
            deltaD = distance(points[i], points[inext]);
            points[i].x = points[i].x;
            points[i].y = points[i].y;
            points[i].dd = deltaD;
            points[i].d = totalD;
            totalD += deltaD;
        }

        // resample points
        // and build soundwave
        this.data = [];
        this.soundwave = [];
        let currentD = 0;
        let delta = 0.001;
        for (let i = 0; i < points.length; i++) {
            let inext = (i + 1) % points.length;
            while (currentD < points[i].d + points[i].dd) {
                let interpolation = interpolate2d(
                    points[i],
                    points[inext],
                    (currentD - points[i].d) / points[i].dd
                );
                let sound = layeredperlin(
                    (interpolation.x + cameraX) * scale,
                    (interpolation.y + cameraY) * scale
                );

                this.data.push({
                    x: interpolation.x,
                    y: interpolation.y,
                    z: sound
                });

                this.soundwave.push(sound);

                currentD += delta
            }
        }

        let s = '';
        for (let i = 0; i < points.length; i++) {
            s += i + '\t' + points[i].x + '\t' + points[i].y + '\t' + points[i].dd + '\t' + points[i].d + '\n';
        }
        console.log(s);
        s = '';
        for (let i = 0; i < this.data.length; i++) {
            s += i + '\t' + this.data[i].x + '\t' + this.data[i].y + '\t' + this.data[i].z + '\n';
        }
        console.log(s);
        s = '';
        for (let i = 0; i < this.soundwave.length; i++) {
            s += i + '\t' + this.soundwave[i] + '\n';
        }
        console.log(s);
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