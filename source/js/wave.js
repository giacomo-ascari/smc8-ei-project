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

        let minX = 1000000, minY = 1000000, maxX = -1000000, maxY = -1000000;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].x < minX) minX = this.data[i].x;
            if (this.data[i].x > maxX) maxX = this.data[i].x;
            if (this.data[i].y < minY) minY = this.data[i].y;
            if (this.data[i].y > maxY) maxY = this.data[i].y;
        }
        this.boundaries = {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
        this.center = {x: (maxX - minX) / 2, y: (maxY - minY) / 2, z: 0}

        this.source = audioContext.createBufferSource();
        this.panner = audioContext.createPanner();

        this.source.connect(this.panner);
        this.panner.connect(audioContext.destination);

        this.panner.panningModel = "HRTF"; // or equalpower
        this.panner.distanceModel = "inverse"; // or linear or exponential
        this.panner.refDistance = 0.5;
        //this.panner.maxDistance = 10000;
        this.panner.rolloffFactor = 1;
        this.panner.coneInnerAngle = 360;
        //this.panner.coneOuterAngle = 0;
        //this.panner.coneOuterGain = 0;

        //this.panner.positionX.setValueAtTime(this.center.x, audioContext.currentTime);
        //this.panner.positionY.setValueAtTime(this.center.y, audioContext.currentTime);
        //this.panner.positionZ.setValueAtTime(this.center.z, audioContext.currentTime);

        this.panner.positionX.setValueAtTime(this.data[0].x, audioContext.currentTime);
        this.panner.positionY.setValueAtTime(this.data[0].y, audioContext.currentTime);
        this.panner.positionZ.setValueAtTime(0, audioContext.currentTime);


        this.source.buffer = buffer;
        this.source.loop = true;
        this.source.start();
    }

    destroy() {
        this.source.stop();
    }
}

function printAudioStatus(waves) {

    let listener = audioContext.listener;

    if (waves != undefined) {
        for (let i = 0; i < waves.length; i++) {
            let panner = waves[i].panner;
            let distanceToL = distance(
                {x: panner.positionX.value, y: panner.positionY.value},
                {x: listener.positionX.value, y: listener.positionY.value}
            );
            console.log(
                "Wave", i,
                "| x", twoDecimals(panner.positionX.value),
                "| y", twoDecimals(panner.positionY.value),
                "| z", twoDecimals(panner.positionZ.value),
                "| dtl", twoDecimals(distanceToL));
        }
    }
    console.log(
        "Listener | x", twoDecimals(listener.positionX.value),
        "| y", twoDecimals(listener.positionY.value),
        "| z", twoDecimals(listener.positionZ.value));
}


function updateListener(cameraX, cameraY) {

    let listener = audioContext.listener;

    listener.forwardX.setValueAtTime(0, audioContext.currentTime); // direction it faces
    listener.forwardY.setValueAtTime(1, audioContext.currentTime);
    listener.forwardZ.setValueAtTime(0, audioContext.currentTime);
    listener.upX.setValueAtTime(0, audioContext.currentTime); // top of the head direction
    listener.upY.setValueAtTime(0, audioContext.currentTime);
    listener.upZ.setValueAtTime(1, audioContext.currentTime);
    listener.positionX.setValueAtTime(-cameraX, audioContext.currentTime);
    listener.positionY.setValueAtTime(0.5-cameraY, audioContext.currentTime);
    listener.positionZ.setValueAtTime(0.5, audioContext.currentTime);
}