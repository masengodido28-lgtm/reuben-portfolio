
/* =========================================================
   ABOUT PAGE JAVASCRIPT
   Handles:
   1. Scroll reveal animations
   2. Hamburger nav toggle
========================================================= */


/* =========================================================
   1. SCROLL REVEAL
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
   2. HAMBURGER NAV TOGGLE
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
   3. INITIALISE ABOUT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initNavToggle();
});
