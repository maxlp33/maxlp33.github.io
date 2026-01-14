document.addEventListener('DOMContentLoaded', () => {
    const starryBg = document.getElementById('starry-bg');
    if (!starryBg) return;

    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random();
        if (size > 0.8) {
            star.classList.add('large');
        } else if (size > 0.5) {
            star.classList.add('medium');
        } else {
            star.classList.add('small');
        }
        
        const speed = Math.random();
        if (speed > 0.7) {
            star.classList.add('fast');
        } else if (speed < 0.3) {
            star.classList.add('slow');
        }
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starryBg.appendChild(star);
    }
    
    for (let i = 0; i < 150; i++) {
        createStar();
    }
});
