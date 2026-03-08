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


