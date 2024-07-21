class Terrain {

    constructor(chunkSpaceSize, chunkFrequency, scale, amplitude) {
        
        this.chunks = [];

        this.chunkSpaceSize = chunkSpaceSize;
        this.chunkFrequency = chunkFrequency;
        this.scale = scale;
        this.amplitude = amplitude;

        this.xRenderCenter = 0;
        this.yRenderCenter = 0;

        this.xRadius = 3;
        this.yRadius = 2;

        this.worker = new Worker('js/worker.js');

        this.worker.onmessage = (e) => {
            
            let c = new Chunk(e.data.spaceSize, e.data.frequency, e.data.xCorner, e.data.yCorner, e.data.scale, e.data.amplitude);
            c.space = e.data.space;
            if (!this.chunkExists(c.xCorner, c.yCorner)) {
                this.chunks.push(c);
            } else {
                console.log("duplicate chunk received from worker");
            }
        };
        
        this.updateChunks(0, 0);
    }

    chunkExists(i, j) {
        for (let c = 0; c < this.chunks.length; c++) {
            if (this.chunks[c].xCorner == i && this.chunks[c].yCorner == j) {
                return true;
            }
        }
        return false;
    }

    updateChunks(cameraX, cameraY) {
        
        this.xRenderCenter = Math.floor(-cameraX / (this.chunkSpaceSize * this.scale))
        this.yRenderCenter = Math.floor(-cameraY / (this.chunkSpaceSize * this.scale))

        let toKeep = [];
        for (let i = this.xRenderCenter-this.xRadius; i < this.xRenderCenter+this.xRadius; i++) {
            for (let j = this.yRenderCenter-this.yRadius; j < this.yRenderCenter+this.yRadius; j++) {
                toKeep.push({i:i, j:j});
                if (!this.chunkExists(i, j)) {
                    // tell worker to make a new chunk
                    this.worker.postMessage({
                        randomSpace: randomSpace,
                        spaceSize: this.chunkSpaceSize,
                        frequency: this.chunkFrequency,
                        xCorner: i,
                        yCorner: j,
                        scale: this.scale,
                        amplitude: this.amplitude
                    });
                }
            }
        }

        // delete chunks (not needed probably)
        /*for (let c = 0; c < this.chunks.length; c++) {
            let found = false;
            for (let k = 0; k < toKeep.length; k++) {
                if (this.chunks[c].xCorner == toKeep[k].i && this.chunks[c].yCorner == toKeep[k].j) {
                    found = true;
                }
            }

            if (!found) {
                this.chunks.splice(c, 1)
                c--;
            }

        }*/

    }

}