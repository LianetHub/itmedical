export const lazy = () => {

    const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');


    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;

                if (lazyImage.hasAttribute("src")) {
                    lazyImage.src = lazyImage.dataset.src
                    lazyImage.removeAttribute('data-src');
                    lazyImage.removeAttribute('height');
                }
                if (lazyImage.hasAttribute("srcset")) {
                    lazyImage.srcset = lazyImage.dataset.srcset;
                    lazyImage.removeAttribute('data-srcset');
                }
                imgObserver.unobserve(lazyImage);
            }
        })
    });

    lazyImages.forEach((lazyImage) => {
        imageObserver.observe(lazyImage);
    });

    const loadVideoIfIntersecting = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                const video = entry.target;
                if (video.paused) {
                    video.play();
                }
                observer.unobserve(video);
            }
        });
    };


    const videoObserver = new IntersectionObserver(loadVideoIfIntersecting);

    const videos = document.querySelectorAll('video');


    videos.forEach(video => {
        videoObserver.observe(video);
    });


};



