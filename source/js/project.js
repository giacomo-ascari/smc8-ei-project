
class Project {

    constructor() {
        // terrain ofc
        this.terrain = new Terrain();
        // rendering data
        this.cameraX = 0;
        this.cameraY = 0;
        this.width = 0;
        this.height = 0;
        // gesture data
        this.bufferIndex = 0;
        this.rightHand = new Hand();
        this.leftHand = new Hand();
        this.ready = true;
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
            //this.cameraX -= Math.floor((this.leftHand.position.x - this.leftHand.draggingStart.x) * this.width);
            //this.cameraY += Math.floor((this.leftHand.position.y - this.leftHand.draggingStart.y) * this.height);
            // reset dragging after applying the delta
            this.leftHand.draggingStart = this.leftHand.position;
        }
        if (this.rightHand.active && this.rightHand.isDragging) {
            //this.cameraX -= Math.floor((this.rightHand.position.x - this.rightHand.draggingStart.x) * this.width);
            //this.cameraY += Math.floor((this.rightHand.position.y - this.rightHand.draggingStart.y) * this.height);
            // reset dragging after applying the delta
            this.rightHand.draggingStart = this.rightHand.position;
        }

        
    }
}