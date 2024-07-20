class Wave {

    constructor(points, cameraX, cameraY, scale, frequency) {
        
        // the input points are an array of {x:, y:}

        this.cameraX = cameraX;
        this.cameraY = cameraY;

        // adjust coordinates
        // add distance (current to next, both absolute and relative)
        // from (x,y) points to (x,y,dd,d)
        let totalD = 0;
        let deltaD = 0;
        for (let i = 0; i < points.length; i++) {
            let inext = (i + 1) % points.length;
            deltaD = distance(points[i], points[inext]);
            points[i].x = 0.5 - points[i].x - cameraX; // x is flipped thanks mediapipe
            points[i].y = points[i].y - 0.5 - cameraY;
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
                    (interpolation.x) * width / scale / frequency,
                    (interpolation.y) * height / frequency / scale  
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
    }
}