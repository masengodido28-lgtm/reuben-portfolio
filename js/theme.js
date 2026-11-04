/* =========================================================
   THEME TOGGLE — js/theme.js
   Loaded by every page. Manages dark / light mode.

   Priority order:
     1. Saved preference in localStorage
     2. OS-level prefers-color-scheme
     3. Falls back to light
   ========================================================= */

(function () {
    'use strict';

    const STORAGE_KEY = 'rl-theme';
    const html = document.documentElement;

    /* ── Determine initial theme ───────────────────────── */
    function getPreferred() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    /* ── Apply theme to <html> ─────────────────────────── */
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        // Update every toggle button on the page
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        });
    }

    /* ── Toggle handler ────────────────────────────────── */
    function toggle() {
        const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next    = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    /* ── Wire up any .theme-toggle buttons ─────────────── */
    function wireButtons() {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            // Avoid double-binding if script runs twice
            if (btn.dataset.themeWired) return;
            btn.dataset.themeWired = 'true';
            btn.addEventListener('click', toggle);
        });
    }

    /* ── Apply immediately (before paint) ─────────────── */
    applyTheme(getPreferred());

    /* ── Wire buttons once DOM is ready ───────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireButtons);
    } else {
        wireButtons();
    }

    /* ── React to OS preference changes ───────────────── */
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
            // Only follow OS if the user hasn't made a manual choice
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
})();
