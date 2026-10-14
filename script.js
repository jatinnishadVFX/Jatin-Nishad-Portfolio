const canvas = document.getElementById('animationCanvas');
const context = canvas.getContext('2d');

const frameCount = 240;
const currentFrame = index => `Man standing/Man_standing_${index.toString().padStart(5, '0')}.webp`;
const imageCount = frameCount;
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
    // Fetch only nearby frames on every screen size; scrolling loads the next batch.
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

// Load the same scroll-driven animation on desktop and mobile.
loadFrame(0);
preloadFramesNear(0);

let renderPending = false;
window.addEventListener('scroll', () => {
    if (renderPending) return;

    renderPending = true;
    requestAnimationFrame(() => {
        renderPending = false;
        renderFrameForScroll();
    });
}, { passive: true });

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
