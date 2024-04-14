class Smoother3d {
    constructor () {
        this.old = {x: 0, y: 0, z: 0};
    }
    process(input) {
        let res = {};
        res.x = 0.3 * input.x + 0.7 * this.old.x;
        res.y = 0.3 * input.y + 0.7 * this.old.y;
        res.z = 0.3 * input.z + 0.7 * this.old.z;
        this.old.x = input.x;
        this.old.y = input.y;
        this.old.z = input.z;
        return res;
    }
}

class Hand {

    constructor() {
        // raw data from mediapipe
        this.active = false;
        this.gesture = undefined;
        this.position = {x: 0.5, y: 0.5, z: 0.5};
        this.index = {x: 0.5, y: 0.5, z: 0.5};
        // smooth data
        this.posSmoother = new Smoother3d();
        this.indSmoother = new Smoother3d();
        // for gesture related actions
        this.isDragging = false;
        this.isPointing = false;
        this.draggingStart = {x: 0, y: 0, z: 0}
    }

    update(gesture, position, index) {

        // update position data
        this.position = this.posSmoother.process(position);
        this.index = this.indSmoother.process(index);
        
        // update gesture related data

        // dragging
        if (this.gesture != gesture && gesture == "Closed_Fist") {
            // starting dragging action
            this.isDragging = true;
            this.draggingStart = this.position;
        } else if (this.gesture == gesture && gesture != "Closed_Fist") {
            // stopping dragging action;
            this.isDragging = false;
            this.draggingStart = {x: 0, y: 0, z: 0};
        }
        
        // pointing
        this.isPointing = gesture == "Pointing_Up";

        this.gesture = gesture;

        // for visualization purposes
        if (this.position.x < 0.04 || this.position.x > 0.96 || this.position.y < 0.04 || this.position.y > 0.96) {
            this.active = false;
        } else {
            this.active = true;
        }
    }
}