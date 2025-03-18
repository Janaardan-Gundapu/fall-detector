// main.js

// Global threshold settings (you can adjust these based on testing)
const SOUND_THRESHOLD = 20; // Adjust based on ambient noise level
const FALL_CONFIDENCE_THRESHOLD = 0.5; // Threshold for keypoint detection confidence

// Function to send an alert to the server
function sendAlert(message) {
  // Display the alert message on the page
  document.getElementById('status').innerText = message;
  
  // Send alert to the server endpoint (adjust URL as needed)
  fetch('/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      timestamp: Date.now()
    })
  })
  .then(response => response.json())
  .then(data => console.log('Alert sent:', data))
  .catch(err => console.error('Error sending alert:', err));
}

// Access camera and microphone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(async stream => {
    const video = document.getElementById('video');
    video.srcObject = stream;

    // Set up audio processing for loud sound detection
    setupAudioProcessing(stream);

    // Load the PoseNet model for fall detection
    const net = await posenet.load();
    detectPose(net, video);
  })
  .catch(err => {
    console.error("Error accessing media devices.", err);
    document.getElementById('status').innerText = "Error accessing media devices.";
  });

// Function to continuously detect poses from the video stream
async function detectPose(net, video) {
  async function poseDetectionFrame() {
    // Estimate the single pose from the current video frame
    const pose = await net.estimateSinglePose(video, {
      flipHorizontal: false
    });
    // Check if the pose indicates a fall
    if (checkForFall(pose)) {
      sendAlert('Fall detected!');
    }
    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
}

// A basic (placeholder) fall detection algorithm.
// In this example, we check if the nose is too low in the video frame.
function checkForFall(pose) {
  const keypoints = pose.keypoints;
  const nose = keypoints.find(kp => kp.part === 'nose');
  if (nose && nose.position.y > 400 && nose.score > FALL_CONFIDENCE_THRESHOLD) {
    return true;
  }
  return false;
}

// Set up audio processing using the Web Audio API to detect loud sounds
function setupAudioProcessing(stream) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  function analyzeAudio() {
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const deviation = dataArray[i] - 128;
      sum += deviation * deviation;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    if (rms > SOUND_THRESHOLD) {
      sendAlert('Loud sound detected!');
    }
    requestAnimationFrame(analyzeAudio);
  }
  analyzeAudio();
}
