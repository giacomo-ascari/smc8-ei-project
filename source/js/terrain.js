class Terrain {

    constructor() {
        this.chunks = [];
        this.chunkSpaceSize = 30;
        this.chunkFrequency = 15;
        this.xRadius = 2;
        this.yRadius = 2;
        this.scale = 30;

        this.xRenderCenter = 0;
        this.yRenderCenter = 0;

        for (let i = this.xRenderCenter-this.xRadius; i < this.xRenderCenter+this.xRadius; i++) {
            for (let j = this.yRenderCenter-this.yRadius; j < this.yRenderCenter+this.yRadius; j++) {
                let chunk = new Chunk(this.chunkSpaceSize, this.chunkFrequency, i, j, this.scale);
                chunk.build();
                this.chunks.push(chunk);
            }
        }
        
    }

}