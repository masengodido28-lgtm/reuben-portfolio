const track = document.querySelector('.track');
const group = track.querySelector('.group');
const originals = Array.from(group.children);

function buildCarousel() {
  // Clear anything added by a previous build (for window resizes)
  track.querySelectorAll('.group[data-clone]').forEach(g => g.remove());
  group.querySelectorAll('[data-fill]').forEach(el => el.remove());

  // Repeat the logos until one group is wider than the screen
  while (group.scrollWidth > 0 && group.scrollWidth < window.innerWidth) {
    originals.forEach(el => {
      const copy = el.cloneNode(true);
      copy.setAttribute('data-fill', '');
      group.appendChild(copy);
    });
  }

  // Add an identical second group so the loop has no visible jump
  const clone = group.cloneNode(true);
  clone.setAttribute('data-clone', '');
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
}

// Wait for the logos to load so their widths are measured correctly
window.addEventListener('load', buildCarousel);

// Rebuild if the window size changes
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCarousel, 200);
});