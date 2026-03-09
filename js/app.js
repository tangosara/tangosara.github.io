// Wireframe globe
(function () {
    const canvas = document.getElementById('hero-globe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    const NUM_LAT = 11;
    const NUM_LON = 14;
    const SEGMENTS = 80;
    let rot = 0;

    function project(lat, lon) {
        const x = Math.cos(lat) * Math.sin(lon);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lon);
        const xr = x * Math.cos(rot) + z * Math.sin(rot);
        const yr = y;
        const r = Math.min(canvas.width, canvas.height) * 0.48;
        return { x: canvas.width / 2 + xr * r, y: canvas.height / 2 - yr * r, z: x * -Math.sin(rot) + z * Math.cos(rot) };
    }

    function drawGlobe() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0,0,0,0.22)';
        ctx.lineWidth = 1.2;

        // Latitude lines
        for (let i = 1; i < NUM_LAT; i++) {
            const lat = (i / NUM_LAT) * Math.PI - Math.PI / 2;
            ctx.beginPath();
            for (let j = 0; j <= SEGMENTS; j++) {
                const lon = (j / SEGMENTS) * Math.PI * 2;
                const p = project(lat, lon);
                j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Longitude lines
        for (let i = 0; i < NUM_LON; i++) {
            const lon = (i / NUM_LON) * Math.PI * 2;
            ctx.beginPath();
            for (let j = 0; j <= SEGMENTS; j++) {
                const lat = (j / SEGMENTS) * Math.PI - Math.PI / 2;
                const p = project(lat, lon);
                j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        rot += 0.004;
        requestAnimationFrame(drawGlobe);
    }

    drawGlobe();
})();

// Nav: add .scrolled class on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Video: hide placeholder if a real src is set
const video = document.querySelector('.showcase-video');
const videoWrap = document.querySelector('.showcase-video-wrap');
if (video) {
    const src = video.querySelector('source')?.getAttribute('src');
    if (src && src.trim() !== '') {
        video.addEventListener('canplay', () => {
            videoWrap.classList.add('has-video');
        });
    }
}

// Contact dropdown
const contactBtn = document.getElementById('contact-btn');
const contactDropdown = document.getElementById('contact-dropdown');

if (contactBtn && contactDropdown) {
    contactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        contactDropdown.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!contactDropdown.contains(e.target) && e.target !== contactBtn) {
            contactDropdown.classList.remove('open');
        }
    });

    // Copy to clipboard on item click
    contactDropdown.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            const value = item.dataset.copy;
            if (!value) return; // LinkedIn - nothing to copy yet

            navigator.clipboard.writeText(value).then(() => {
                item.classList.add('copied');
                const valueEl = item.querySelector('.contact-value');
                const original = valueEl.textContent;
                valueEl.textContent = 'Copied!';

                // Add tick mark
                let check = item.querySelector('.contact-check');
                if (!check) {
                    check = document.createElement('span');
                    check.className = 'contact-check';
                    check.textContent = '\u2713';
                    valueEl.after(check);
                }

                setTimeout(() => {
                    item.classList.remove('copied');
                    valueEl.textContent = original;
                    if (check) check.remove();
                }, 1500);
            });
        });
    });
}


