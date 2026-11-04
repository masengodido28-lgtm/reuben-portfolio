/* =========================================================
   REVEAL.JS — Scroll-reveal via IntersectionObserver
   Loaded by every page.
   Adds .is-visible to .reveal, .reveal-stagger, and any
   extra selectors passed through data-reveal-extra on <body>.
   ========================================================= */

(function () {
    'use strict';

    // Collect all elements that should animate in
    const selectors = [
        '.reveal',
        '.reveal-stagger',
        '.services',
        '.work',
    ];

    // Pages can opt-in to extra selectors via a data attribute on <body>:
    //   <body data-reveal-extra=".gd-card,.wp-cat-card">
    const extra = document.body.dataset.revealExtra;
    if (extra) selectors.push(...extra.split(',').map(s => s.trim()).filter(Boolean));

    const els = document.querySelectorAll(selectors.join(','));

    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const threshold = parseFloat(document.body.dataset.revealThreshold) || 0.1;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold });

    els.forEach(el => obs.observe(el));
})();
