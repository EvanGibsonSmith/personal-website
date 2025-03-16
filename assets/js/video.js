const videos = document.getElementsByClassName('hover-video'); // Get all video elements

for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const container = video.parentElement; // parent container is video container

    // Add the paused class when the video is paused
    video.addEventListener('pause', () => {
        container.classList.add('paused');
    });

    // Remove the paused class when the video is played
    video.addEventListener('play', () => {
        container.classList.remove('paused');
    });

    video.addEventListener('click', () => {
        if (!video.paused) {
            video.pause(); // Pause video
        } else {
            video.play(); // Play video
        }
    });

    // Prevents the control bar from getting pressed and the video simulatenously, resulting in a double click.
    video.addEventListener('click', (e) => {
        if (e.target !== video) {
            e.stopPropagation();
        }
    });
}
