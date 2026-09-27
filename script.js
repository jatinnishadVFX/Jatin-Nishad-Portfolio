const canvas = document.getElementById('animationCanvas');
const context = canvas.getContext('2d');

const frameCount = 240; 
const currentFrame = index => `Man standing/Man_standing_${index.toString().padStart(5, '0')}.jpg`;

const images = [];
let imagesLoaded = 0;

// Preload all frames
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
    
    img.onload = () => {
        imagesLoaded++;
        if (i === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
        }
    };
}

// Update the frame based on scroll
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    
    const scrollFraction = scrollTop / maxScrollTop;
    
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => updateImage(frameIndex));
});

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
