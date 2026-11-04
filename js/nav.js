/* =========================================================
   NAV.JS — Hamburger / mobile nav toggle
   Loaded by every page.
   ========================================================= */

(function () {
    'use strict';

    const toggle = document.querySelector('.nav-toggle');
    const nav    = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when any nav link is clicked (nice on mobile)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking outside the header
    document.addEventListener('click', e => {
        if (!e.target.closest('.site-header')) {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
})();
