class Terrain {

    constructor() {
        this.chunks = [];
        this.chunkSpaceSize = 32;
        this.chunkFrequency = 15;
        this.xRadius = 2;
        this.yRadius = 1;

        this.xRenderCenter = 0;
        this.yRenderCenter = 0;

        for (let i = this.xRenderCenter-this.xRadius; i < this.xRenderCenter+this.xRadius; i++) {
            for (let j = this.yRenderCenter-this.yRadius; j < this.yRenderCenter+this.yRadius; j++) {
                let chunk = new Chunk(this.chunkSpaceSize, this.chunkFrequency, i, j);
                chunk.build();
                this.chunks.push(chunk);
            }
        }
        
    }

}