//Slideshow code
const slideshow = document.getElementById('slides-slideshow-container');
    const slides = document.querySelectorAll('.img-block.slide');
    const prevBtn = document.getElementById('switch-photo-button-prevBtn');
    const nextBtn = document.getElementById('switch-photo-button-nextBtn');

    let counter = 0;
    const slideWidth = slides[0].clientWidth;

    prevBtn.addEventListener('click', () => {
        counter--;
        if (counter < 0) {
            counter = slides.length - 1;
        }
        updateSlidePosition();
    });

    nextBtn.addEventListener('click', () => {
        counter++;
        if (counter >= slides.length) {
            counter = 0;
        }
        updateSlidePosition();
    });

    function updateSlidePosition() {
        slideshow.style.transform = `translateX(-${counter * slideWidth}px)`;
    }


//Lazy Load code
    document.addEventListener("DOMContentLoaded", function() {
        var lazyImages = [].slice.call(document.querySelectorAll(".img-block[data-src]"));
    
        if ("IntersectionObserver" in window) {
            var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var lazyImage = entry.target;
                        lazyImage.style.backgroundImage = "url(" + lazyImage.getAttribute("data-src") + ")";
                        lazyImage.removeAttribute("data-src");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
    
            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            lazyImages.forEach(function(lazyImage) {
                lazyImage.style.backgroundImage = "url(" + lazyImage.getAttribute("data-src") + ")";
                lazyImage.removeAttribute("data-src");
            });
        }
    });
    