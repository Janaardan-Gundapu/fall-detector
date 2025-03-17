let detector;
let videoElement = document.getElementById('video');
let isFalling = false;

// Initialize the Pose Estimation Model (MoveNet)
async function loadPoseModel() {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        runtime: 'tfjs',
        modelType: 'singlepose',
    });
    detectPose();
}

// Start Pose Detection
async function detectPose() {
    const poses = await detector.estimatePoses(videoElement);

    if (poses.length > 0) {
        let pose = poses[0].keypoints;
        // Check for fall based on specific key points, like knees or shoulders
        detectFall(pose);
    }

    requestAnimationFrame(detectPose); // Keep detecting frames
}

// Detect Fall (simple logic based on keypoints like knees or shoulders)
function detectFall(pose) {
    let leftKnee = pose.find(point => point.name === 'leftKnee');
    let rightKnee = pose.find(point => point.name === 'rightKnee');
    let leftShoulder = pose.find(point => point.name === 'leftShoulder');
    let rightShoulder = pose.find(point => point.name === 'rightShoulder');

    // Simple fall detection: check if knees are too low or shoulders are out of position
    if (leftKnee && rightKnee && leftShoulder && rightShoulder) {
        if (leftKnee.y > leftShoulder.y + 100 || rightKnee.y > rightShoulder.y + 100) {
            if (!isFalling) {
                isFalling = true;
                alert("Fall detected!");
            }
        } else {
            isFalling = false;
        }
    }
}

// Access the camera and start pose detection
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment'
    }
})
.then((stream) => {
    videoElement.srcObject = stream;
    loadPoseModel(); // Load PoseNet after video feed is available
})
.catch((error) => {
    console.error("Error accessing webcam: ", error);
});
