/* =========================================================
   WORK.JS — Work page scroll reveal
   Handles .wp-cat-card reveal (not covered by reveal.js
   defaults because it uses a page-specific class).
   ========================================================= */

(function () {
    'use strict';

    const els = document.querySelectorAll('.wp-cat-card, .reveal');

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
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
})();
