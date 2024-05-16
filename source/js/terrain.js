class Terrain {

    constructor() {
        this.chunks = [];
        this.chunkSpaceSize = 60;
        this.chunkFrequency = 30;
        this.xRadius = 3;
        this.yRadius = 3;
        this.scale = 15;
        this.amplitude = 150;

        this.xRenderCenter = 0;
        this.yRenderCenter = 0;

        /*for (let i = this.xRenderCenter-this.xRadius; i < this.xRenderCenter+this.xRadius; i++) {
            for (let j = this.yRenderCenter-this.yRadius; j < this.yRenderCenter+this.yRadius; j++) {
                let chunk = new Chunk(this.chunkSpaceSize, this.chunkFrequency, i, j, this.scale, this.amplitude);
                chunk.build();
                this.chunks.push(chunk);
            }
        }*/
        
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
                    let chunk = new Chunk(this.chunkSpaceSize, this.chunkFrequency, i, j, this.scale, this.amplitude);
                    chunk.build();
                    this.chunks.push(chunk);
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
                console.log('deleted one')
            }

        }

    }

}