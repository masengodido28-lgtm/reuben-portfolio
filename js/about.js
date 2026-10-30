/* =========================================================
   ABOUT PAGE — js/about.js
   Handles the image carousels for the Tools and
   Certifications sections.
   ========================================================= */

(function () {
    'use strict';

    /* ── Helpers ─────────────────────────────────────────── */

    /**
     * Returns the number of fully visible slides at the current
     * viewport width, matching the CSS breakpoints in about.css.
     */
    function visibleCount() {
        const w = window.innerWidth;
        if (w <= 480) return 1;
        if (w <= 760) return 2;
        if (w <= 900) return 3;
        return 4;
    }

    /**
     * Builds and wires up a carousel.
     *
     * @param {HTMLElement} section  - The <section> containing the carousel
     * @param {string}      trackSel - Selector for .carousel-track inside section
     */
    function initCarousel(section) {
        const track    = section.querySelector('.carousel-track');
        const prevBtn  = section.querySelector('.carousel-btn-prev');
        const nextBtn  = section.querySelector('.carousel-btn-next');
        const dotsWrap = section.querySelector('.carousel-dots');

        if (!track || !prevBtn || !nextBtn) return;

        const slides = Array.from(track.children);
        const total  = slides.length;
        let current  = 0;
        let visible  = visibleCount();

        /* ── Dot generation ────────────────────────────────── */
        function buildDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = '';
            const pages = Math.ceil(total / visible);
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
                dot.addEventListener('click', () => goTo(i * visible));
                dotsWrap.appendChild(dot);
            }
        }

        /* ── Slide sizing ──────────────────────────────────── */
        function resizeSlides() {
            visible = visibleCount();
            const gap        = 20; // px, must match CSS gap
            const clipWidth  = track.parentElement.offsetWidth;
            const slideWidth = (clipWidth - gap * (visible - 1)) / visible;

            slides.forEach(s => {
                s.style.flex = `0 0 ${slideWidth}px`;
            });

            // Rebuild track width so translate works predictably
            track.style.width = (slideWidth * total + gap * (total - 1)) + 'px';
        }

        /* ── Navigation ────────────────────────────────────── */
        function goTo(index) {
            visible = visibleCount();
            const maxIndex = total - visible;
            current = Math.max(0, Math.min(index, maxIndex));

            const gap       = 20;
            const clipWidth = track.parentElement.offsetWidth;
            const slideW    = (clipWidth - gap * (visible - 1)) / visible;
            const offset    = current * (slideW + gap);

            track.style.transform = `translateX(-${offset}px)`;

            // Button states
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current >= maxIndex;

            // Dot states
            if (dotsWrap) {
                const activePage = Math.floor(current / visible);
                Array.from(dotsWrap.children).forEach((dot, i) => {
                    dot.classList.toggle('is-active', i === activePage);
                });
            }
        }

        /* ── Touch / swipe ─────────────────────────────────── */
        let touchStartX = 0;
        let touchDeltaX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchDeltaX = 0;
        }, { passive: true });

        track.addEventListener('touchmove', e => {
            touchDeltaX = e.touches[0].clientX - touchStartX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (Math.abs(touchDeltaX) > 40) {
                touchDeltaX < 0 ? goTo(current + visible) : goTo(current - visible);
            }
            touchDeltaX = 0;
        });

        /* ── Button listeners ──────────────────────────────── */
        prevBtn.addEventListener('click', () => goTo(current - visible));
        nextBtn.addEventListener('click', () => goTo(current + visible));

        /* ── Keyboard on the section ───────────────────────── */
        section.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - visible); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + visible); }
        });

        /* ── Resize handler ────────────────────────────────── */
        let rzTimer;
        window.addEventListener('resize', () => {
            clearTimeout(rzTimer);
            rzTimer = setTimeout(() => {
                resizeSlides();
                buildDots();
                goTo(0); // reset to start on resize — keeps layout clean
            }, 150);
        });

        /* ── Init ──────────────────────────────────────────── */
        resizeSlides();
        buildDots();
        goTo(0);
    }

    /* ── Scroll-reveal (mirrors index.html inline script) ── */
    function initReveal() {
        const singles  = document.querySelectorAll('.reveal');
        const staggers = document.querySelectorAll('.reveal-stagger');

        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-visible');
                        obs.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        singles.forEach(el  => obs.observe(el));
        staggers.forEach(el => obs.observe(el));
    }

    /* ── Boot ──────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        // Wire up both carousels by their section id
        const toolsSection = document.getElementById('tools');
        const certsSection = document.getElementById('certificates');

        if (toolsSection) initCarousel(toolsSection);
        if (certsSection) initCarousel(certsSection);

        initReveal();
    });

})();
