const canvas = document.getElementById('animationCanvas');
const context = canvas.getContext('2d');

const frameCount = 240;
const currentFrame = index => `Man standing/Man_standing_${index.toString().padStart(5, '0')}.webp`;
const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
const imageCount = isSmallScreen ? 1 : frameCount;
const images = Array(imageCount).fill(null);
let currentFrameIndex = 0;

function loadFrame(index) {
    if (index < 0 || index >= imageCount || images[index]) return;

    const img = new Image();
    img.decoding = 'async';
    images[index] = img;

    img.onload = () => {
        if (index === currentFrameIndex) updateImage(index);
    };

    img.src = currentFrame(index);
}

function preloadFramesNear(index) {
    if (isSmallScreen) return;

    // Fetch only nearby frames; scrolling farther loads the next small batch.
    for (let offset = -3; offset <= 8; offset++) {
        loadFrame(index + offset);
    }
}

function renderFrameForScroll() {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    currentFrameIndex = Math.min(imageCount - 1, Math.floor(scrollFraction * imageCount));

    preloadFramesNear(currentFrameIndex);
    updateImage(currentFrameIndex);
}

// Keep the background static on phones; desktop loads the sequence on demand.
loadFrame(0);
preloadFramesNear(0);
window.addEventListener('scroll', renderFrameForScroll, { passive: true });

function updateImage(index) {
    const img = images[index];
    if (img && img.complete) {
        if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        context.drawImage(img, 0, 0);
    }
}
