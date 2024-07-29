// Copyright 2023 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//      http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
    GestureRecognizer,
    HandLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let gestureRecognizer = undefined;
let enableWebcamButton;
let webcamRunning = false;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
            delegate: "GPU"
        },
        numHands: 2,
        runningMode: "VIDEO"
    });
};
createGestureRecognizer();

/********************************************************************
// Continuously grab image from webcam stream and detect it.
********************************************************************/

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("landmarksCanvas");
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
// And also control the running of predictions
function enableCam(event) {
    if (!gestureRecognizer) {
        console.log("Wait! Mediapipe not loaded yet.");
        return;
    }

    let tutorialDiv = document.getElementById("tutorial");
    tutorialDiv.style.display = "none";

    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "START PREDICTIONS";
    } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "PAUSE PREDICTIONS";
    }

    // getUsermedia parameters.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results = undefined;



// The core functionality
async function predictWebcam() {

    if (window.mediapipeResults == undefined) {
        window.mediapipeResults = [];
    }

    canvasElement.style.width = video.style.width;
    canvasElement.style.height = video.style.height;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        for (let i = 0; i < results.landmarks.length; i++) {
            const landmarks = results.landmarks[i];
            //console.log(results.handednesses[i][0].categoryName, ":", results.gestures[i][0].categoryName);
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: "#FFFF00", lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, { color: "#FF8800", lineWidth: 2 });

            let centerPos = {x: 0, y: 0, z: 0}; // 5 index knuckle, 17 pinky knuckle, 0 wrist
            centerPos.x = (landmarks[5].x + landmarks[17].x + landmarks[0].x) / 3;
            centerPos.y = (landmarks[5].y + landmarks[17].y + landmarks[0].y) / 3;
            centerPos.z = (landmarks[5].z + landmarks[17].z + landmarks[0].z) / 3;

            let result = {
                handedness: results.handednesses[i][0].categoryName,
                gesture:  results.gestures[i][0].categoryName,
                centerPos: centerPos,
                indexPos: landmarks[8]
            }

            window.mediapipeResults.push(result);
        }
    }
    canvasCtx.restore();

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}
