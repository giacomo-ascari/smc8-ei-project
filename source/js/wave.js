const audioContext = new AudioContext();

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
        let currentD = 0;
        let delta = 0.0007;
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

                currentD += delta
            }
        }

        let buffer = audioContext.createBuffer(1, this.data.length, 44100);
        // add the elements of this.soundwave to the buffer
        for (let i = 0; i < this.data.length; i++) {
            buffer.getChannelData(0)[i] = this.data[i].z;
        }

        this.source = audioContext.createBufferSource();
        this.source.buffer = buffer;
        this.source.loop = true;
        this.source.connect(audioContext.destination);
        this.source.start();
    }

    getBoundaries() {
        let minX = 1000000, minY = 1000000, maxX = -1000000, maxY = -1000000;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].x < minX) minX = this.data[i].x;
            if (this.data[i].x > maxX) maxX = this.data[i].x;
            if (this.data[i].y < minY) minY = this.data[i].y;
            if (this.data[i].y > maxY) maxY = this.data[i].y;
        }
        return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
    }

    destroy() {
        this.source.stop();
    }
}