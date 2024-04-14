
class Project {

    constructor(canvas, ctx) {
        // terrain ofc
        this.terrain = new Terrain(50, 50, 10)
        // rendering data
        this.cameraX = 0;
        this.cameraY = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = 0;
        this.height = 0;
        // gesture data
        this.bufferIndex = 0;
        this.rightHand = new Hand();
        this.leftHand = new Hand();
    }

    render() {       

        this.ctx.clearRect(0, 0, this.width, this.height);
        const zoom = this.terrain.zoom;

        // render terrain according to camera
        iterate2d(this.terrain.xSize, this.terrain.ySize, (x, y, onBorder) => {
            this.ctx.fillStyle = this.terrain.chunk.colors[x][y];
            this.ctx.fillRect(this.cameraX + x*zoom, this.cameraY + y*zoom, zoom, zoom);
        })

        // right and left hands

        // draw the right hand
        if (this.rightHand.active) {
            if (this.rightHand.isDragging) this.ctx.fillStyle = "#ff0000";
            else if (this.rightHand.isPointing) this.ctx.fillStyle = "#00ff00";
            else this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect((1-this.rightHand.position.x) * this.width-10, this.rightHand.position.y * this.height-10, 20, 20);
        }
        
        // draw the left hand
        if (this.leftHand.active) {
            if (this.leftHand.isDragging) this.ctx.fillStyle = "#ff0000";
            else if (this.leftHand.isPointing) this.ctx.fillStyle = "#00ff00";
            else this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect((1-this.leftHand.position.x) * this.width-10, this.leftHand.position.y * this.height-10, 20, 20);
        }
    }

    resize() {
        // damn you browsers
        this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
    }

    update(mediapipeResults) {

        // if new data is available
        while (mediapipeResults.length > this.bufferIndex) {

            let res = mediapipeResults[this.bufferIndex];

            // update the current hands
            if (res.handedness == "Right") {
                this.rightHand.update(res.gesture, res.centerPos, res.indexPos);
            } else if (res.handedness == "Left") {
                this.leftHand.update(res.gesture, res.centerPos, res.indexPos);
            }

            this.bufferIndex++;
        }

        // after everyting is updated, act!

        // apply the dragging
        // two hands apply are summed together and i like this
        if (this.leftHand.active && this.leftHand.isDragging) {
            this.cameraX -= Math.floor((this.leftHand.position.x - this.leftHand.draggingStart.x) * this.width);
            this.cameraY += Math.floor((this.leftHand.position.y - this.leftHand.draggingStart.y) * this.height);
            // reset dragging after applying the delta
            this.leftHand.draggingStart = this.leftHand.position;
        }
        if (this.rightHand.active && this.rightHand.isDragging) {
            this.cameraX -= Math.floor((this.rightHand.position.x - this.rightHand.draggingStart.x) * this.width);
            this.cameraY += Math.floor((this.rightHand.position.y - this.rightHand.draggingStart.y) * this.height);
            // reset dragging after applying the delta
            this.rightHand.draggingStart = this.rightHand.position;
        }

        
    }
}