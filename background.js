const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

const particles = [];
const particleCount = 120;

// create particles with slower speed
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.2, // much slower
        dy: (Math.random() - 0.5) * 0.2  // much slower
    });
}

function getColor(x, y) {
    const r = Math.floor((x / canvas.width) * 50); // dimmer red
    const g = Math.floor((y / canvas.height) * 100); // dimmer green
    const b = 150; // dimmer blue
    return `rgba(${r},${g},${b},0.4)`; // lower opacity for dim effect
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, idx) => {
        ctx.fillStyle = getColor(p.x, p.y);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
                ctx.strokeStyle = getColor(p.x, p.y);
                ctx.lineWidth = 0.5; // thinner line
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        if (mouse.x && mouse.y) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distMouse = Math.hypot(dx, dy);
            if (distMouse < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distMouse)/25; // weaker repulse
                p.dx += Math.cos(angle)*force;
                p.dy += Math.sin(angle)*force;
            }
        }
    });

    requestAnimationFrame(animate);
}

animate();
