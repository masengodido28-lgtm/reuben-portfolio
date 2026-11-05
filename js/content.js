
/* =========================================================
   CONTENT PAGE — js/content.js
   Handles the video gallery and video player modal.
   ========================================================= */


/* =========================
   1. CLOUDFLARE R2 SETTINGS
========================= */

const R2_BASE_URL =
    "https://pub-7340b1ba7eea4d748d0197271a70e003.r2.dev";


/* =========================
   2. VIDEO COLLECTION
========================= */

const videos = [

    {
        title: "Bangerville — Matric Dance Edition",
        category: "Events & Lifestyle",
        filename: "Bangerville-%20Matric%20Dance%20Edition%20%F0%9F%98%86%F0%9F%94%A5%F0%9F%92%83%F0%9F%8F%BD-%20%40heyyythato%20%F0%9F%91%97-%20%40keys_fashion.mp4"
    },

    {
        title: "Bryan Podcast Trailer",
        category: "Podcast & Media",
        filename: "Bryan%20Podcast%20trailer%20%28final%29.mp4"
    },

    {
        title: "Grace Harding — Trailer",
        category: "Promotional Content",
        filename: "Grace%20Harding%20trailer%20landscape.mp4"
    },

    {
        title: "Matric Dance — Nolanga Made",
        category: "Fashion & Lifestyle",
        filename: "Matric%20DanceDress%20by-%20%40nolanga_made%20Model-%20%40sinemihlen.mp4"
    },

    {
        title: "Mood — Silky. Scent. Divine.",
        category: "Fashion & Lifestyle",
        filename: "Mood-%20Silky.%20Scent-%20Divine.%20Secret-%20Comfort.%F0%9F%92%83%F0%9F%8F%BD-%20%40swazi_elihle_%20%F0%9F%93%B9%20%26%20%F0%9F%8E%A8-%20%40shep_.gram%20Assistant-.mp4"
    },

    {
        title: "Morning",
        category: "Creative Visuals",
        filename: "Morning.mp4"
    },

    {
        title: "One for the Newspaper",
        category: "Events & Lifestyle",
        filename: "One%20for%20the%20news%E2%80%A6paper%20%F0%9F%93%B9%23matricdance%20%23md25%20%23prom%20%23beauty.mp4"
    },

    {
        title: "SDP — Matric Dance",
        category: "Events & Lifestyle",
        filename: "SDP-%20MATRIC%20DANCE.mp4"
    },

    {
        title: "SP — Behind the Scenes",
        category: "Behind the Scenes",
        filename: "SP%20BTS%20FINAL%201.mp4"
    },

    {
        title: "Shopping with Mbbaarrhliii & Luuyyanda",
        category: "Lifestyle & Fashion",
        filename: "Shopping%20with%20%40mbbaarrhliii%20and%20%40luuyyanda%20%23reel%20%23shopping%20%23cottonon.mp4"
    },

    {
        title: "SpecSpon",
        category: "Commercial Content",
        filename: "SpecSpon.mp4"
    },

    {
        title: "Just Like Sunday — Summer Aftermovie",
        category: "Events & Aftermovies",
        filename: "The%20Aftermovie%F0%9F%8E%A5%20_%20Just%20Like%20Sunday%20Social%20Club-%20Summer%20Edition%20%E2%98%80%EF%B8%8FThank%20you%20to%20everyone%20of%20you%20t.mp4"
    },

    {
        title: "Matric Dance Reel",
        category: "Events & Lifestyle",
        filename: "%F0%9F%92%83%F0%9F%8F%BD%F0%9F%92%83%F0%9F%8F%BD%F0%9F%92%83%F0%9F%8F%BD%23matricdance%20%23md25.mp4"
    }

];


/* =========================
   3. GET HTML ELEMENTS
========================= */

const gallery = document.getElementById("video-gallery-grid");

const videoModal = document.getElementById("video-modal");

const modalVideo = document.getElementById("modal-video");

const modalVideoTitle = document.getElementById("modal-video-title");

const closeModalButtons = document.querySelectorAll("[data-close-modal]");

const closeButton = document.querySelector(".video-modal-close");

let previouslyFocusedElement = null;


/* =========================
   4. CREATE VIDEO GALLERY
========================= */

function displayVideos() {

    if (!gallery) return;

    gallery.innerHTML = "";

    videos.forEach((video, index) => {

        // Create the card container
        const card = document.createElement("article");

        card.className = "video-card";

        // Create the clickable cover
        const button = document.createElement("button");

        button.className = "video-card-button";

        button.type = "button";

        button.setAttribute(
            "aria-label",
            `Play ${video.title}`
        );

        button.dataset.videoIndex = index;

        // Create the cover content
        const cover = document.createElement("div");

        cover.className = "video-card-cover";

        cover.innerHTML = `
            <span class="video-card-number">
                ${String(index + 1).padStart(2, "0")} / ${String(videos.length).padStart(2, "0")}
            </span>

            <div class="video-card-cover-bottom">

                <div>
                    <p class="video-card-category">
                        ${video.category}
                    </p>

                    <h3 class="video-card-cover-title">
                        ${video.title}
                    </h3>
                </div>

                <span class="video-play-icon" aria-hidden="true">
                    ▶
                </span>

            </div>
        `;

        // Add the cover to the button
        button.appendChild(cover);

        // Create the information below the cover
        const information = document.createElement("div");

        information.className = "video-card-info";

        information.innerHTML = `
            <div>
                <h3 class="video-card-title">
                    ${video.title}
                </h3>

                <p class="video-card-type">
                    ${video.category}
                </p>
            </div>

            <span class="video-card-watch">
                WATCH VIDEO ↗
            </span>
        `;

        // Put everything inside the card
        card.appendChild(button);

        card.appendChild(information);

        // Add the card to the gallery
        gallery.appendChild(card);

    });

}


/* =========================
   5. OPEN VIDEO PLAYER
========================= */

function openVideo(index) {

    const selectedVideo = videos[index];

    if (!selectedVideo || !videoModal || !modalVideo) return;

    // Remember where the visitor was before opening the player
    previouslyFocusedElement = document.activeElement;

    // Set the video title
    modalVideoTitle.textContent = selectedVideo.title;

    // Build the full Cloudflare video URL
    const videoURL = `${R2_BASE_URL}/${selectedVideo.filename}`;

    // Show the modal
    videoModal.hidden = false;

    videoModal.setAttribute("aria-hidden", "false");

    // Prevent the background page from scrolling
    document.body.style.overflow = "hidden";

    // Load the selected video only after the visitor clicks it
    modalVideo.src = videoURL;

    modalVideo.load();

    // Start playback
    const playPromise = modalVideo.play();

    if (playPromise !== undefined) {

        playPromise.catch((error) => {

            console.warn("Video playback could not start:", error);

        });

    }

    // Move keyboard focus to the close button
    closeButton?.focus();

}


/* =========================
   6. CLOSE VIDEO PLAYER
========================= */

function closeVideo() {

    if (!videoModal || !modalVideo) return;

    // Stop playback
    modalVideo.pause();

    // Remove the video source
    modalVideo.removeAttribute("src");

    modalVideo.load();

    // Hide the modal
    videoModal.hidden = true;

    videoModal.setAttribute("aria-hidden", "true");

    // Allow background scrolling again
    document.body.style.overflow = "";

    // Return keyboard focus to the previous element
    if (previouslyFocusedElement) {

        previouslyFocusedElement.focus();

    }

}


/* =========================
   7. GALLERY CLICK EVENTS
========================= */

if (gallery) {

    gallery.addEventListener("click", (event) => {

        const clickedButton = event.target.closest(
            ".video-card-button"
        );

        if (!clickedButton) return;

        const videoIndex = Number(
            clickedButton.dataset.videoIndex
        );

        openVideo(videoIndex);

    });

}


/* =========================
   8. CLOSE BUTTON EVENTS
========================= */

closeModalButtons.forEach((button) => {

    button.addEventListener("click", closeVideo);

});


/* =========================
   9. KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", (event) => {

    // Close the player with Escape
    if (
        event.key === "Escape" &&
        videoModal &&
        !videoModal.hidden
    ) {

        closeVideo();

    }

});


/* =========================
   10. FOOTER YEAR
========================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =========================
   11. INITIALISE THE PAGE
========================= */

displayVideos();
