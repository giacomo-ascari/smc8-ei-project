class Terrain {

    constructor() {
        this.chunks = [];
        this.chunkSpaceSize = 60;
        this.chunkFrequency = 30;
        
        if (width <= 1920 && height <= 1080) {
            this.scale = 15;
        } else {
            this.scale = 18;
        }

        this.amplitude = 150;

        this.xRenderCenter = 0;
        this.yRenderCenter = 0;

        this.xRadius = 2;
        this.yRadius = 2;

        this.worker = new Worker('js/worker.js');

        this.worker.onmessage = (e) => {
            
            let c = new Chunk(e.data.spaceSize, e.data.frequency, e.data.xCorner, e.data.yCorner, e.data.scale, e.data.amplitude);
            c.space = e.data.space;
            if (!this.chunkExists(c.xCorner, c.yCorner)) {
                console.log("duplicate chunk received from worker");
                this.chunks.push(c);
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

        for (let c = 0; c < this.chunks.length; c++) {
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

        }

    }

}