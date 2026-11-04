/* =========================================================
   GRAPHIC-DESIGN.JS — Graphic design page interactions
   - Filter pills
   - Scroll reveal for .gd-card
   - Lightbox (open, close, prev/next, keyboard, backdrop)
   ========================================================= */

/* ── Scroll reveal ───────────────────────────────────────── */
(function () {
    'use strict';

    const els = document.querySelectorAll('.gd-card, .reveal');

    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.06 });

    els.forEach(el => obs.observe(el));
})();


/* ── Filter pills ────────────────────────────────────────── */
(function () {
    'use strict';

    const filters = document.querySelectorAll('.gd-filter');
    const cards   = document.querySelectorAll('.gd-card');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.filter;

            filters.forEach(f => f.classList.remove('is-active'));
            btn.classList.add('is-active');

            cards.forEach(card => {
                const match = cat === 'all' || card.dataset.category === cat;
                card.dataset.hidden = match ? 'false' : 'true';
                if (match && !card.classList.contains('is-visible')) {
                    card.classList.add('is-visible');
                }
            });
        });
    });
})();


/* ── Lightbox ────────────────────────────────────────────── */
(function () {
    'use strict';

    const lb      = document.getElementById('gdLightbox');
    const lbImg   = document.getElementById('gdLbImg');
    const lbTitle = document.getElementById('gdLbTitle');
    const lbCat   = document.getElementById('gdLbCat');
    const lbClose = document.getElementById('gdLbClose');
    const lbPrev  = document.getElementById('gdLbPrev');
    const lbNext  = document.getElementById('gdLbNext');

    if (!lb) return;

    let visibleCards = [];
    let current = 0;

    function getVisible() {
        return Array.from(document.querySelectorAll('.gd-card'))
            .filter(c => c.dataset.hidden !== 'true');
    }

    function render() {
        const card = visibleCards[current];
        if (!card) return;

        const img   = card.querySelector('img');
        const title = card.querySelector('.gd-card-title');
        const cat   = card.querySelector('.gd-card-cat');

        lbImg.src   = img.src;
        lbImg.alt   = img.alt;
        lbTitle.textContent = title ? title.textContent.trim() : '';
        lbCat.textContent   = cat   ? cat.textContent.trim()   : '';
        lbPrev.disabled = current === 0;
        lbNext.disabled = current === visibleCards.length - 1;
    }

    function open(card) {
        visibleCards = getVisible();
        current = visibleCards.indexOf(card);
        render();
        lb.removeAttribute('hidden');
        requestAnimationFrame(() => lb.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function close() {
        lb.classList.remove('is-open');
        setTimeout(() => {
            lb.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }, 300);
    }

    function prev() { if (current > 0)                        { current--; render(); } }
    function next() { if (current < visibleCards.length - 1)  { current++; render(); } }

    // Wire up cards
    document.querySelectorAll('.gd-card').forEach(card => {
        card.addEventListener('click', () => open(card));
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click',  prev);
    lbNext.addEventListener('click',  next);

    // Click backdrop to close
    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    // Keyboard: Esc = close, ← / → = navigate
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });
})();
