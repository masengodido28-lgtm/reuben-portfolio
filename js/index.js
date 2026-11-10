/* =========================================================
   INDEX.JS — Home page specific interactions
   - Hero cursor parallax tilt
   - Service card deck-of-cards tap to deal
   - Flip-card tap-to-flip on mobile / touch devices
   ========================================================= */

/* ── Hero cursor parallax tilt ──────────────────────────── */
(function () {
    'use strict';

    const visual = document.querySelector('.hero-visual');
    if (!visual) return;

    let raf = null;

    document.addEventListener('mousemove', e => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        const tx = dx * 7;
        const ty = dy * -5;

        if (!raf) {
            raf = requestAnimationFrame(() => {
                visual.style.transform =
                    `perspective(900px) rotateY(${tx}deg) rotateX(${ty}deg)`;
                raf = null;
            });
        }
    });

    document.addEventListener('mouseleave', () => {
        if (!raf) {
            raf = requestAnimationFrame(() => {
                visual.style.transform =
                    'perspective(900px) rotateY(0deg) rotateX(0deg)';
                raf = null;
            });
        }
    });
})();


/* ── Service cards — deck of cards, tap to deal ──────────── */
(function () {
    'use strict';

    const grid = document.querySelector('.service-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.service-card'));
    const n = cards.length;
    if (!n) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dealt = false;
    let tidyTimer = null;
    let rzTimer   = null;

    function stackDeck() {
        const cx   = grid.offsetWidth  / 2;
        const cy   = grid.offsetHeight / 2;
        const half = (n - 1) / 2;

        cards.forEach((card, i) => {
            const cardCx = card.offsetLeft + card.offsetWidth  / 2;
            const cardCy = card.offsetTop  + card.offsetHeight / 2;
            const dx  = cx - cardCx;
            const dy  = cy - cardCy;
            const rot = (i - half) * 4;

            card.style.transition = 'none';
            card.style.transform  = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
            card.style.zIndex     = String(20 - Math.abs(i - half));
        });

        requestAnimationFrame(() => {
            cards.forEach(c => { c.style.transition = ''; });
        });
    }

    function dealDeck() {
        if (dealt) return;
        dealt = true;

        grid.classList.remove('is-deck');
        grid.classList.add('is-dealt');
        grid.removeAttribute('role');
        grid.removeAttribute('tabindex');
        grid.removeAttribute('aria-label');

        const dur = reduceMotion ? 0.01 : 0.7;
        cards.forEach(card => {
            card.style.transition =
                `transform ${dur}s var(--transition-smooth), box-shadow 0.35s ease`;
            card.style.transform = '';
            card.style.zIndex    = '';
        });

        grid.removeEventListener('click',   dealDeck);
        grid.removeEventListener('keydown', onKey);

        window.clearTimeout(tidyTimer);
        tidyTimer = window.setTimeout(() => {
            cards.forEach(c => {
                c.style.transition = '';
                // Wire up tap-to-flip now that the deck is dealt
                initFlipTap(c);
            });
        }, dur * 1000 + 80);
    }

    function onKey(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            dealDeck();
        }
    }

    function onResize() {
        if (dealt) return;
        window.clearTimeout(rzTimer);
        rzTimer = window.setTimeout(stackDeck, 150);
    }

    stackDeck();

    grid.addEventListener('click',   dealDeck);
    grid.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    window.addEventListener('load',  () => { if (!dealt) stackDeck(); });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { if (!dealt) stackDeck(); });
    }
})();


/* ── Flip-card tap-to-flip (touch / keyboard) ────────────── */
/*
   On desktop hover is handled by CSS (.service-grid.is-dealt .service-card:hover).
   On touch devices there's no hover, so we toggle .is-flipped on tap.
   Clicking a .flip-card-link navigates normally and doesn't re-flip.
*/
function initFlipTap(card) {
    'use strict';

    // Keyboard: Enter/Space toggles the flip
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('is-flipped');
        }
    });

    // Touch: tap anywhere on the card flips it;
    // tapping the link inside lets it navigate normally.
    card.addEventListener('click', e => {
        // Let link clicks pass through
        if (e.target.closest('.flip-card-link')) return;

        // Only flip on touch / pointer:coarse devices
        if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
            card.classList.toggle('is-flipped');
        }
    });
}
