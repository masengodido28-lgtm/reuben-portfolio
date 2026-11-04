
/* =========================================================
   ABOUT PAGE JAVASCRIPT
   Handles:
   1. Automatic carousels
   2. Scroll reveal animations
========================================================= */


/* =========================================================
   1. AUTOMATIC CAROUSEL
========================================================= */

function initCarousel(section) {

    const track = section.querySelector(".carousel-track");
    const clip = section.querySelector(".carousel-track-clip");

    if (!track || !clip) return;

    // Original slides before creating the looping copies
    const originalSlides = Array.from(track.children);

    if (originalSlides.length < 2) return;

    const gap = 20;
    const speed = 3000;

    let currentIndex = 0;
    let visibleSlides = 4;
    let slideWidth = 0;
    let autoplayInterval = null;
    let isPaused = false;

    // Save the original slides so we can rebuild on resize
    const slides = originalSlides;

    // Work out how many slides should be visible
    function getVisibleSlides() {

        if (window.innerWidth <= 480) {
            return 1;
        }

        if (window.innerWidth <= 760) {
            return 2;
        }

        if (window.innerWidth <= 900) {
            return 3;
        }

        return 4;
    }


    // Set up the slide widths and create copies for looping
    function setupCarousel() {

        // Remove old cloned slides before rebuilding
        track.querySelectorAll(".carousel-clone").forEach(clone => {
            clone.remove();
        });

        visibleSlides = Math.min(
            getVisibleSlides(),
            slides.length
        );

        const clipWidth = clip.clientWidth;

        slideWidth =
            (clipWidth - gap * (visibleSlides - 1)) / visibleSlides;

        // Apply consistent widths to original slides
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}px`;
        });

        // Copy enough slides to make the loop appear continuous
        slides.slice(0, visibleSlides).forEach(slide => {

            const clone = slide.cloneNode(true);

            clone.classList.add("carousel-clone");
            clone.setAttribute("aria-hidden", "true");

            // Prevent cloned images from being announced
            clone.querySelectorAll("img").forEach(image => {
                image.alt = "";
            });

            // Prevent cloned content from receiving keyboard focus
            clone.querySelectorAll("a, button, input, select, textarea").forEach(element => {
                element.setAttribute("tabindex", "-1");
            });

            clone.style.flex = `0 0 ${slideWidth}px`;

            track.appendChild(clone);
        });

        // Reset position without animation after resizing
        currentIndex = 0;
        track.style.transition = "none";
        moveCarousel();

        // Allow the browser to apply the reset before restoring transition
        requestAnimationFrame(() => {
            track.style.transition = "";
        });
    }


    // Move the carousel to the current slide
    function moveCarousel() {

        const distance = currentIndex * (slideWidth + gap);

        track.style.transform = `translateX(-${distance}px)`;
    }


    // Move forward by one slide
    function nextSlide() {

        if (isPaused) return;

        currentIndex++;

        moveCarousel();

        // When the original slides finish, reset to the beginning
        if (currentIndex === slides.length) {

            setTimeout(() => {

                currentIndex = 0;

                track.style.transition = "none";

                moveCarousel();

                requestAnimationFrame(() => {
                    track.style.transition = "";
                });

            }, 700);
        }
    }


    // Start automatic movement
    function startAutoplay() {

        stopAutoplay();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        autoplayInterval = setInterval(nextSlide, speed);
    }


    // Stop automatic movement
    function stopAutoplay() {

        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }


    // Pause when the visitor interacts with the carousel
    clip.addEventListener("mouseenter", () => {
        isPaused = true;
    });

    clip.addEventListener("mouseleave", () => {
        isPaused = false;
    });

    // Also pause when using keyboard navigation
    clip.addEventListener("focusin", () => {
        isPaused = true;
    });

    clip.addEventListener("focusout", () => {
        isPaused = false;
    });


    // Recalculate slide sizes when the screen changes
    let resizeTimeout;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            setupCarousel();
        }, 150);

    });


    // Initial setup
    setupCarousel();
    startAutoplay();

    // Stop moving when the browser tab is hidden
    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }

    });

}


/* =========================================================
   2. SCROLL REVEAL
========================================================= */

function initScrollReveal() {

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-stagger"
    );

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15
    });


    revealElements.forEach(element => {
        observer.observe(element);
    });

}


/* =========================================================
   3. HAMBURGER NAV TOGGLE
========================================================= */

function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav    = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when a nav link is tapped (single-page feel)
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close when clicking outside the header
    document.addEventListener("click", e => {
        if (!e.target.closest(".site-header")) {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* =========================================================
   4. INITIALISE ABOUT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const toolsCarousel = document.querySelector("#tools");
    const certificatesCarousel = document.querySelector("#certificates");

    if (toolsCarousel) {
        initCarousel(toolsCarousel);
    }

    if (certificatesCarousel) {
        initCarousel(certificatesCarousel);
    }

    initScrollReveal();
    initNavToggle();

});
