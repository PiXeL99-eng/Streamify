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
