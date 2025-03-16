let lastPositionY = 0;
let lastTime = Date.now();
let isFalling = false;

const video = document.getElementById('video');

// Function to detect sudden changes in height (e.g., fall)
function detectFall() {
    let currentTime = Date.now();
    let deltaTime = (currentTime - lastTime) / 1000; // Time difference in seconds

    // Get the current Y position of the video feed (camera position)
    let currentPositionY = video.getBoundingClientRect().top; // Top position of the video element

    // Calculate the speed of movement in the Y direction (vertical speed)
    let fallSpeed = (lastPositionY - currentPositionY) / deltaTime;

    // If the speed is above a certain threshold, and there's a significant drop, trigger a fall detection
    if (fallSpeed > 1.0 && lastPositionY - currentPositionY > 2.0 && !isFalling) {
        isFalling = true;
        alert("Fall detected!"); // Trigger fall detection alert
    }

    // Update last position and time for the next check
    lastPositionY = currentPositionY;
    lastTime = currentTime;

    requestAnimationFrame(detectFall); // Keep calling detectFall to track in real time
}

// Start detecting falls when the video feed starts
video.addEventListener('play', function() {
    detectFall();
});
