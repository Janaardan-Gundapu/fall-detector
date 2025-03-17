let lastPositionY = 0;
let lastTime = Date.now();
let isFalling = false;
let frameCount = 0;
let fallDetectionThreshold = 200; // Threshold in px
let speedThreshold = 0.3; // Speed in px/s
let stabilizationTime = 1000; // 1 second for stabilization
let stabilizedTime = 0;
let thresholdTime = 2000; // 2 seconds to allow stabilization

const video = document.getElementById('video');

// Function to detect sudden changes in height (fall detection)
function detectFall() {
    let currentTime = Date.now();
    let deltaTime = (currentTime - lastTime) / 1000; // Time in seconds

    let currentPositionY = video.getBoundingClientRect().top; // Top position of the video element

    // Skip detection during the initial frames to allow stabilization
    if (frameCount < 10) {
        frameCount++;
        requestAnimationFrame(detectFall);
        return; // Skip fall detection in the first few frames
    }

    // Skip detection in the first few seconds to allow stabilization
    if (currentTime - lastTime < thresholdTime) {
        requestAnimationFrame(detectFall);
        return; // Skip fall detection in the first few seconds
    }

    let verticalSpeed = Math.abs(lastPositionY - currentPositionY) / deltaTime;

    // If the vertical position and speed indicate a significant fall
    if (Math.abs(lastPositionY - currentPositionY) > fallDetectionThreshold && verticalSpeed > speedThreshold && !isFalling) {
        if (stabilizedTime > stabilizationTime) {
            isFalling = true;
            alert("Fall detected!");
            console.log("Fall detected!");
        }
    } else {
        stabilizedTime = 0; // Reset stabilization time if no significant movement
    }

    lastPositionY = currentPositionY;
    lastTime = currentTime;
    
    // If not falling, increment stabilization time
    if (!isFalling) {
        stabilizedTime += deltaTime * 1000; // Increase stabilization time in ms
    }

    requestAnimationFrame(detectFall); // Continue fall detection
}

// Start detection when the video feed starts
video.addEventListener('play', function () {
    // Initialize lastPositionY and lastTime for proper calculations
    lastPositionY = video.getBoundingClientRect().top;
    lastTime = Date.now();
    detectFall();
});

// Access the back camera (rear camera)
navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
})
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.error('Error accessing webcam: ', error);
        alert('Error accessing webcam: ' + error.message);
    });
