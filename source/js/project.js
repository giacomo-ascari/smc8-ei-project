
class Project {

    constructor() {
        this.amplitude = 150;
        this.scale = 15;
        if (width > 1920 || height > 1080) this.scale = 18;
        // terrain ofc
        this.terrain = new Terrain(60, 30, this.scale, this.amplitude);
        // rendering data
        this.cameraX = 0;
        this.cameraY = 0;
        // gesture data
        this.bufferIndex = 0;
        this.rightHand = new Hand();
        this.leftHand = new Hand();
        this.rightHandTrace = [];
        this.leftHandTrace = [];
        this.waves = [];
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
            this.cameraX -= this.leftHand.position.x - this.leftHand.draggingStart.x;
            this.cameraY += this.leftHand.position.y - this.leftHand.draggingStart.y;
            // reset dragging after applying the delta
            this.leftHand.draggingStart = this.leftHand.position;
        }
        if (this.rightHand.active && this.rightHand.isDragging) {
            this.cameraX -= this.rightHand.position.x - this.rightHand.draggingStart.x;
            this.cameraY += this.rightHand.position.y - this.rightHand.draggingStart.y;
            // reset dragging after applying the delta
            this.rightHand.draggingStart = this.rightHand.position;
        }

        // apply the pointing and build trace if complete
        if (this.leftHand.active && this.leftHand.isPointing) {
            this.leftHandTrace.push({x: this.leftHand.position.x, y: this.leftHand.position.y});
        } else if (this.leftHand.active && this.leftHandTrace.length > 10) {
            // build wave if trace is complete
            let wave = new Wave(this.leftHandTrace, 10000, this.cameraX, this.cameraY);
            console.log("aaaa");
            this.waves.push(wave);
            this.leftHandTrace = [];
        } else {
            this.leftHandTrace = [];
        }
        if (this.rightHand.active && this.rightHand.isPointing) {
            this.rightHandTrace.push({x: this.rightHand.position.x, y: this.rightHand.position.y});
        } else {
            this.rightHandTrace = [];
        }

    }
}