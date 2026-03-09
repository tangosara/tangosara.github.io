// Wireframe globe — split colour: black on orange, orange on dark sidebar
(function () {
    const canvas = document.getElementById('hero-globe');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = false;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    camera.position.z = 3.2;

    const geo     = new THREE.IcosahedronGeometry(1.15, 5);
    const wireGeo = new THREE.WireframeGeometry(geo);

    // Two materials — swapped per scissor pass
    const matBlack  = new THREE.LineBasicMaterial({ color: 0x0c0c0c, opacity: 0.3,  transparent: true });
    const matOrange = new THREE.LineBasicMaterial({ color: 0xff8c00, opacity: 0.45, transparent: true });
    const matInnerBlack  = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.04 });
    const matInnerOrange = new THREE.MeshBasicMaterial({ color: 0xff8c00, transparent: true, opacity: 0.06 });

    const globe = new THREE.LineSegments(wireGeo, matBlack);
    scene.add(globe);
    const innerMesh = new THREE.Mesh(new THREE.SphereGeometry(1.09, 32, 32), matInnerBlack);
    scene.add(innerMesh);

    function resize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        const isMobile = window.innerWidth <= 900;
        // Globe pushed to top-right corner, large + cropped
        globe.position.set(isMobile ? 0.8 : 1.1, isMobile ? 1.9 : 1.5, 0);
        innerMesh.position.copy(globe.position);
        camera.position.z = isMobile ? 3.2 : 2.2;
        camera.updateProjectionMatrix();
    }
    // Defer first resize so layout is ready
    requestAnimationFrame(resize);
    window.addEventListener('resize', resize);

    // Get CSS-pixel x where orange ends and sidebar begins
    function getSplitX() {
        const sidebar = document.querySelector('.hero-sidebar');
        if (!sidebar || window.innerWidth <= 900) return canvas.clientWidth;
        return sidebar.getBoundingClientRect().left - canvas.getBoundingClientRect().left;
    }

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
        innerMesh.rotation.copy(globe.rotation);

        // Three.js setScissor/setViewport take CSS pixels (it handles DPR internally)
        const W      = canvas.clientWidth;
        const H      = canvas.clientHeight;
        const splitW = getSplitX();
        if (!W || !H) return;

        renderer.clear();
        renderer.setScissorTest(true);

        // Left (orange bg) — black globe
        globe.material     = matBlack;
        innerMesh.material = matInnerBlack;
        renderer.setScissor(0, 0, splitW, H);
        renderer.setViewport(0, 0, W, H);
        renderer.render(scene, camera);

        // Right (dark sidebar) — orange globe
        globe.material     = matOrange;
        innerMesh.material = matInnerOrange;
        renderer.setScissor(splitW, 0, W - splitW, H);
        renderer.setViewport(0, 0, W, H);
        renderer.render(scene, camera);

        renderer.setScissorTest(false);
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


