// Create an AudioContext instance
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load the audio clip
const audioClipURL = 'spinnerAudio.m4a';

// Create a GainNode to control the volume
const gainNode = audioContext.createGain();

// Connect the gain node to the audio destination
gainNode.connect(audioContext.destination);

// Function to load and play the audio clip
const playAudioClip = async () => {
  try {
    const response = await fetch(audioClipURL);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create a new AudioBufferSourceNode for each play
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;

    // Connect the audio source to the gain node
    audioSource.connect(gainNode);

    // Start playing the audio
    audioSource.start(0);
  } catch (error) {
    console.log('Error loading audio clip:', error);
  }
};

// Function to adjust the volume based on the speed variable
const adjustVolume = (speed) => {
  // Calculate the volume based on the speed threshold
  const threshold = 1; // Adjust this value as needed
  const volume = Math.max(0, speed / threshold);
  console.log(speed + " " + volume)
  // Set the volume using the gain node
  gainNode.gain.value = volume;
};

export { adjustVolume, playAudioClip };