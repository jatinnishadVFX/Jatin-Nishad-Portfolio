const canvas = document.getElementById('animationCanvas');
const context = canvas.getContext('2d');

const frameCount = 240; 
const currentFrame = index => `Man standing/Man_standing_${index.toString().padStart(5, '0')}.jpg`;
const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
const frameIndexes = isSmallScreen ? [0] : Array.from({ length: frameCount }, (_, index) => index);

const images = [];

// Keep the animated background static on small screens to avoid downloading
// 240 large image frames over a mobile connection.
for (const frameIndex of frameIndexes) {
    const img = new Image();
    img.src = currentFrame(frameIndex);
    images.push(img);
    
    img.onload = () => {
        if (frameIndex === 0) {
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
        images.length - 1,
        Math.floor(scrollFraction * images.length)
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
