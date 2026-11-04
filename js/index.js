/* =========================================================
   INDEX.JS — Home page specific interactions
   - Hero cursor parallax tilt
   - Service / work card magnetic hover
   - Service card deck-of-cards tap to deal
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
        const dx = (e.clientX - cx) / cx; // -1 → 1
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


/* ── Magnetic card hover ─────────────────────────────────── */
(function () {
    'use strict';

    const cards = document.querySelectorAll('.service-card, .work-card');

    function inDeck(card) {
        if (!card.classList.contains('service-card')) return false;
        const g = card.closest('.service-grid');
        return !!g && g.classList.contains('is-deck');
    }

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            if (inDeck(card)) return;

            const r  = card.getBoundingClientRect();
            const cx = r.left + r.width  / 2;
            const cy = r.top  + r.height / 2;
            const dx = (e.clientX - cx) / (r.width  / 2);
            const dy = (e.clientY - cy) / (r.height / 2);

            card.style.setProperty('--mx', `${dx * 4}deg`);
            card.style.setProperty('--my', `${dy * -3}deg`);
            card.style.transform =
                `translateY(-7px) scale(1.012)
                 perspective(600px)
                 rotateY(${dx * 4}deg)
                 rotateX(${dy * -3}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            if (inDeck(card)) return;
            card.style.transform = '';
        });
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
            cards.forEach(c => { c.style.transition = ''; });
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
