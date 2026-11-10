/* =========================================================
   THUMBNAILS.JS
   Lazily generates a thumbnail for each video card by:
   1. Waiting for the card's cover element to enter the viewport
   2. Loading the first ~1 second of the video into a hidden
      <video> element (crossorigin="anonymous")
   3. Seeking to 1 s (or 0 if the video is shorter)
   4. Painting the frame onto a hidden <canvas>
   5. Setting the result as the cover's background-image

   The gradient background acts as a placeholder until the
   frame is ready, so cards never appear broken.

   Usage:
     thumbnailQueue.add(coverElement, videoURL);

   Both content.js and home-videos.js call this after
   building their cards.
   ========================================================= */

const thumbnailQueue = (function () {
    'use strict';

    // One reusable hidden video + canvas (never attached to DOM)
    const scrubber = document.createElement('video');
    scrubber.muted      = true;
    scrubber.playsInline = true;
    scrubber.preload    = 'metadata';
    scrubber.crossOrigin = 'anonymous';
    scrubber.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(scrubber);

    const canvas  = document.createElement('canvas');
    const ctx     = canvas.getContext('2d');

    // Queue of { coverEl, url } waiting to be processed
    const pending = [];
    let   busy    = false;

    function processNext() {
        if (busy || pending.length === 0) return;
        busy = true;

        const { coverEl, url } = pending.shift();

        function cleanup() {
            scrubber.removeEventListener('seeked',   onSeeked);
            scrubber.removeEventListener('error',    onError);
            scrubber.removeEventListener('loadedmetadata', onMeta);
        }

        function onMeta() {
            // Seek to 1 s or midpoint, whichever is earlier
            const target = Math.min(1, scrubber.duration * 0.1);
            scrubber.currentTime = isNaN(target) ? 0 : target;
        }

        function onSeeked() {
            cleanup();
            try {
                canvas.width  = scrubber.videoWidth  || 640;
                canvas.height = scrubber.videoHeight || 360;
                ctx.drawImage(scrubber, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/jpeg', 0.72);
                // Apply as background — keep the gradient on top for readability
                coverEl.style.backgroundImage =
                    `linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%), url("${dataURL}")`;
                coverEl.style.backgroundSize     = 'cover';
                coverEl.style.backgroundPosition = 'center';
            } catch (e) {
                // Cross-origin taint or decode error — gradient fallback stays
            }
            // Release the video src so it doesn't keep buffering
            scrubber.pause();
            scrubber.removeAttribute('src');
            scrubber.load();
            busy = false;
            processNext();
        }

        function onError() {
            cleanup();
            scrubber.removeAttribute('src');
            scrubber.load();
            busy = false;
            processNext();
        }

        scrubber.addEventListener('loadedmetadata', onMeta,   { once: true });
        scrubber.addEventListener('seeked',         onSeeked, { once: true });
        scrubber.addEventListener('error',          onError,  { once: true });

        scrubber.src = url;
        scrubber.load();
    }

    // IntersectionObserver: only load a thumbnail once the card
    // scrolls close to the viewport (rootMargin: 200px ahead)
    const io = ('IntersectionObserver' in window)
        ? new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    io.unobserve(el);
                    // The URL was stored on the element as a data attr
                    pending.push({ coverEl: el, url: el.dataset.thumbSrc });
                    processNext();
                }
            });
          }, { rootMargin: '200px' })
        : null;

    return {
        /**
         * Schedule a thumbnail for the given cover element.
         * @param {HTMLElement} coverEl  - The .hv-cover or .video-card-button element
         * @param {string}      videoURL - Full URL of the video on R2
         */
        add(coverEl, videoURL) {
            if (!coverEl || !videoURL) return;
            coverEl.dataset.thumbSrc = videoURL;
            if (io) {
                io.observe(coverEl);
            } else {
                pending.push({ coverEl, url: videoURL });
                processNext();
            }
        }
    };
})();
