/**
 * Lightweight canvas confetti — zero dependencies.
 * Spawns 60 colourful particles that fall and fade over ~2 s.
 */
export function fireConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    const colors = ['#F2B8C6', '#8FC4B0', '#F8C9A0', '#C9C0DE', '#EE9090', '#F5C771', '#A8CEDD'];
    const particles = Array.from({ length: 80 }, () => ({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * 0.6,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
    }));

    let frame = 0;
    const maxFrames = 120;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.x += p.vx;
            p.vy += 0.3; // gravity
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.life = Math.max(0, 1 - frame / maxFrames);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        }
        frame++;
        if (frame < maxFrames) {
            requestAnimationFrame(draw);
        } else {
            canvas.remove();
        }
    }
    requestAnimationFrame(draw);
}
