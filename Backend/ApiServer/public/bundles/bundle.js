(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const videoGallery = document.getElementById('videoGallery');

// Function to fetch video data from the backend
const fetchVideos = async () => {
    try {
        const response = await fetch('streamify/allvideos');
        const userVideos = await response.json();
        console.log(userVideos)
        // Display video boxes in the gallery
        userVideos.forEach(videoInfo => {
            videoInfo.videos.forEach(video => {
                const videoBox = createVideoBox(video);
                videoGallery.appendChild(videoBox);
            });
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
};

// Function to create a video box element
const createVideoBox = (video) => {
    const videoBox = document.createElement('div');
    videoBox.className = 'video-box';

    const videoTitle = document.createElement('div');
    videoTitle.className = 'video-title';
    videoTitle.textContent = video.videoDesc;

    const videoPreview = document.createElement('img');
    videoPreview.className = 'video-preview';
    videoPreview.src = video.previewImageUrl;
    videoPreview.alt = "Live Stream";

    videoBox.appendChild(videoTitle);
    videoBox.appendChild(videoPreview);

    return videoBox;
};

// Fetch videos when the page loads
fetchVideos();

},{}]},{},[1]);
