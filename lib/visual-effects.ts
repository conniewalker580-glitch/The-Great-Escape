// Balloon animation utility for success celebrations
export function triggerBalloons() {
    const colors = ['#06b6d4', '#a855f7', '#f59e0b', '#ec4899', '#10b981'];
    const balloonCount = 15;

    for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = Math.random() * 100 + '%';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(balloon);

            setTimeout(() => balloon.remove(), 4000);
        }, i * 100);
    }
}

// Glow effect for correct answers
export function triggerGlowEffect(element: HTMLElement | null) {
    if (!element) return;

    element.classList.add('glow-success');
    setTimeout(() => {
        element.classList.remove('glow-success');
    }, 2000);
}

// Particle burst effect
export function triggerParticleBurst(x: number, y: number) {
    const particleCount = 30;
    const colors = ['#06b6d4', '#a855f7', '#fbbf24'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-burst';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
}
