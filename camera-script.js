let lastPositionY = 0;
let lastTime = Date.now();
let isFalling = false;
let isFallTriggered = false; // Flag to trigger fall after some time
let speedThreshold = 0.2; // Minimum speed required to detect a fall (adjust as needed)
let movementThreshold = 3; // Minimum distance the camera must travel to be considered a fall (adjust as needed)

const video = document.getElementById('video');

// Function to detect sudden changes in height (e.g., fall)
function detectFall() {
    let currentTime = Date.now();
    let deltaTime = (currentTime - lastTime) / 1000; // Time difference in seconds

    // Get the current Y position of the video feed (camera position)
    let currentPositionY = video.getBoundingClientRect().top; // Top position of the video element

    // Calculate the speed of movement in the Y direction (vertical speed)
    let fallSpeed = (lastPositionY - currentPositionY) / deltaTime; // Speed (distance/time)

    // Check if the fall speed and height difference meet the threshold
    if (Math.abs(lastPositionY - currentPositionY) > movementThreshold && Math.abs(fallSpeed) > speedThreshold && !isFalling) {
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
video.addEventListener('play', function() {
    detectFall();
});

// Access the back camera (rear camera)
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: { exact: "environment" }  // Use the rear camera
    }
})
.then(function(stream) {
    // Get the video element and set the stream as the source
    const video = document.getElementById('video');
    video.srcObject = stream;
})
.catch(function(error) {
    console.error('Error accessing webcam: ', error);
    alert('Error accessing webcam: ' + error.message);  // Display error to user
});
