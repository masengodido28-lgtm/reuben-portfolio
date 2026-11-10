/* =========================================================
   HOME-VIDEOS.JS
   Powers the 4-video "Work I've Done" preview on index.html.
   Opens and closes a lightweight inline video modal.
   ========================================================= */

(function () {
    'use strict';

    const R2 = 'https://pub-7340b1ba7eea4d748d0197271a70e003.r2.dev';

    /* 4 featured videos — swap filenames/titles any time */
    const featured = [
        {
            title: 'Bangerville — Matric Dance',
            category: 'Events & Lifestyle',
            filename: 'Bangerville-%20Matric%20Dance%20Edition%20%F0%9F%98%86%F0%9F%94%A5%F0%9F%92%83%F0%9F%8F%BD-%20%40heyyythato%20%F0%9F%91%97-%20%40keys_fashion.mp4'
        },
        {
            title: 'Bryan Podcast Trailer',
            category: 'Podcast & Media',
            filename: 'Bryan%20Podcast%20trailer%20%28final%29.mp4'
        },
        {
            title: 'Grace Harding — Trailer',
            category: 'Promotional Content',
            filename: 'Grace%20Harding%20trailer%20landscape.mp4'
        },
        {
            title: 'Mood — Silky. Scent. Divine.',
            category: 'Fashion & Lifestyle',
            filename: 'Mood-%20Silky.%20Scent-%20Divine.%20Secret-%20Comfort.%F0%9F%92%83%F0%9F%8F%BD-%20%40swazi_elihle_%20%F0%9F%93%B9%20%26%20%F0%9F%8E%A8-%20%40shep_.gram%20Assistant-.mp4'
        }
    ];

    /* Gradient pairs that match the content page card colours */
    const gradients = [
        'linear-gradient(135deg, #263b34, #101714)',
        'linear-gradient(135deg, #34302c, #171514)',
        'linear-gradient(135deg, #343b43, #171b20)',
        'linear-gradient(135deg, #4b3931, #211915)'
    ];

    /* ── Build grid ───────────────────────────────────────── */
    const grid = document.getElementById('home-video-grid');
    if (!grid) return;

    featured.forEach((v, i) => {
        const card = document.createElement('article');
        card.className = 'hv-card';

        card.innerHTML = `
            <button class="hv-btn" type="button" aria-label="Play ${v.title}"
                    data-src="${R2}/${v.filename}">
                <div class="hv-cover" style="background:${gradients[i]}">
                    <span class="hv-num">0${i + 1} / 04</span>
                    <div class="hv-cover-bottom">
                        <div>
                            <p class="hv-category">${v.category}</p>
                            <h3 class="hv-title">${v.title}</h3>
                        </div>
                        <span class="hv-play" aria-hidden="true">▶</span>
                    </div>
                </div>
            </button>
            <div class="hv-info">
                <span class="hv-info-title">${v.title}</span>
                <span class="hv-watch">WATCH ↗</span>
            </div>
        `;

        grid.appendChild(card);

        // Schedule thumbnail generation for this card
        const coverEl = card.querySelector('.hv-cover');
        if (coverEl && typeof thumbnailQueue !== 'undefined') {
            thumbnailQueue.add(coverEl, `${R2}/${v.filename}`);
        }
    });

    /* ── Modal ────────────────────────────────────────────── */
    const modal   = document.getElementById('hv-modal');
    const modalVid = document.getElementById('hv-modal-video');
    const modalTitle = document.getElementById('hv-modal-title');
    const closeBtn = document.getElementById('hv-modal-close');
    const backdrop = document.getElementById('hv-modal-backdrop');

    if (!modal || !modalVid) return;

    let lastFocus = null;

    function openModal(src, title) {
        lastFocus = document.activeElement;
        modalVid.src = src;
        modalTitle.textContent = title;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalVid.load();
        modalVid.play().catch(() => {});
        closeBtn.focus();
    }

    function closeModal() {
        modalVid.pause();
        modalVid.removeAttribute('src');
        modalVid.load();
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }

    grid.addEventListener('click', e => {
        const btn = e.target.closest('.hv-btn');
        if (!btn) return;
        openModal(btn.dataset.src, btn.querySelector('.hv-title').textContent);
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

})();
