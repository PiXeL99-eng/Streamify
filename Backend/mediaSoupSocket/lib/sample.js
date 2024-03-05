const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const { spawn } = require('child_process');
const fs = require('fs');

// Input video file names
const screenVideo = './data/screen.webm';
const camVideo = './data/cam.webm';

// Output video file name
const outputVideo = '../data/output.webm';

// FFmpeg command with video overlay, audio merging, and volume adjustment
const ffmpegCommand = [
    '-y',
    '-i', screenVideo,
    '-i', camVideo,
    '-filter_complex', '[1:a]volume=1.5[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2[outa];[0:v][1:v]overlay=10:H-h-10[outv]',
    '-map', '[outv]',
    '-map', '[outa]',
    '-c:v', 'libvpx',
    '-c:a', 'libvorbis',
    '-b:a', '192k',
    outputVideo
  ];

// Spawn the FFmpeg child process
const ffmpegProcess = spawn(ffmpegPath, ffmpegCommand);

// Event listeners for handling output and errors
ffmpegProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
  console.error(`${data}`);
});

ffmpegProcess.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  fs.access(outputVideo, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File does not exist at path: ${outputVideo}`);
    } else {
      console.log(`File exists at path: ${outputVideo}`);
    }
  });

});

ffmpegProcess.on('error', (err) => {
  console.error(`Error spawning FFmpeg process: ${err}`);
});

