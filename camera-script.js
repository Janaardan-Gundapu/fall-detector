let lastPositionY = 0;
let lastTime = Date.now();
let isFalling = false;
let frameCount = 0; // Counter for frames to ignore initial false positives
let fallDetectionThreshold = 200; // Threshold to consider a fall (in px)
let speedThreshold = 0.3; // Minimum speed required for detecting a fall (in px/s)

const video = document.getElementById('video');

// Function to detect sudden changes in height (e.g., fall)
function detectFall() {
    let currentTime = Date.now();
    let deltaTime = (currentTime - lastTime) / 1000; // Time difference in seconds

    // Get the current Y position of the video feed (camera position)
    let currentPositionY = video.getBoundingClientRect().top; // Top position of the video element

    // Skip the first few frames for stabilization (to avoid initial false positives)
    if (frameCount < 10) {
        frameCount++;
        requestAnimationFrame(detectFall); // Continue detecting after skipping frames
        return; // Skip fall detection in the first few frames
    }

    // Calculate the vertical speed (movement per second)
    let verticalSpeed = Math.abs(lastPositionY - currentPositionY) / deltaTime;

    // Check if the camera position has changed significantly and is moving fast enough to be considered a fall
    if (Math.abs(lastPositionY - currentPositionY) > fallDetectionThreshold && verticalSpeed > speedThreshold && !isFalling) {
        isFalling = true;
        alert("Fall detected!"); // Trigger fall detection alert
        console.log("Fall detected!");
    }

    // Update last position and time for the next check
    lastPositionY = currentPositionY;
    lastTime = currentTime;

    // Call detectFall every frame
    requestAnimationFrame(detectFall);
}

// Start detecting falls when the video feed starts
video.addEventListener('play', function () {
    detectFall();
});

// Access the back camera (rear camera)
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment'
    }
})
    .then(function (stream) {
        // Get the video element and set the stream as the source
        const video = document.getElementById('video');
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.error('Error accessing webcam: ', error);
        alert('Error accessing webcam: ' + error.message);  // Display error to user
    });
