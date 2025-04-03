const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// UI Controls
const sizeSlider = document.getElementById("sizeSlider");
const velocitySlider = document.getElementById("velocitySlider");

const particles = [];
const particleCount = 100; // Adjust for density

function createExplosion(x, y) {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * velocitySlider.value, // Speed
            vy: (Math.random() - 0.5) * velocitySlider.value,
            size: parseInt(sizeSlider.value), // Size from slider
            alpha: 1, // Opacity for fade-out
            color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random colors
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
}

// Automated explosions every 1 second
setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    createExplosion(x, y);
}, 1000);

animate();
