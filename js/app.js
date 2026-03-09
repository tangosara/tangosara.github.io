// Wireframe globe (Three.js — ported from original portfolio, colours inverted for orange hero)
(function () {
    const canvas = document.getElementById('hero-globe');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    camera.position.z = 3.2;

    // Wireframe — black on orange
    const geo     = new THREE.IcosahedronGeometry(1.15, 5);
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
        color:       0x0c0c0c,
        opacity:     0.28,
        transparent: true
    });
    const globe = new THREE.LineSegments(wireGeo, wireMat);
    scene.add(globe);

    // Subtle inner fill — very faint dark tint
    const innerMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.09, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.04 })
    );
    scene.add(innerMesh);

    function resize() {
        const p = canvas.parentElement;
        renderer.setSize(p.clientWidth, p.clientHeight);
        camera.aspect = p.clientWidth / p.clientHeight;
        camera.updateProjectionMatrix();
        // Push globe into top-right corner, large and cropped
        const isMobile = window.innerWidth <= 560;
        const xPos = isMobile ? 0.2 : 1.6;
        const yPos = isMobile ? 0   : 1.2;
        globe.position.set(xPos, yPos, 0);
        innerMesh.position.set(xPos, yPos, 0);
        // Zoom camera in so globe is large and fills/overflows the corner
        camera.position.z = isMobile ? 3.2 : 2.2;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Subtle mouse parallax
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 0.4;
        my = (e.clientY / window.innerHeight - 0.5) * 0.25;
    });

    let t = 0;
    (function animate() {
        requestAnimationFrame(animate);
        t += 0.0025;
        globe.rotation.y = t + mx;
        globe.rotation.x = my;
        innerMesh.rotation.y = globe.rotation.y;
        innerMesh.rotation.x = globe.rotation.x;
        renderer.render(scene, camera);
    })();
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


