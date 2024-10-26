const videos = document.getElementsByClassName('hover-video'); // Get all video elements

for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const container = video.parentElement; // parent container is video container

    // Add the paused class when the video is paused
    video.addEventListener('pause', () => {
        container.classList.add('paused'); 
    });

    // Pause the video on click
    video.addEventListener('click', () => {
        if (!video.paused) {
            video.pause(); 
        } else {
            video.play(); 
            container.classList.remove('paused'); 
        }
    });
}
