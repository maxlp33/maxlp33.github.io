// Loading screen controller
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');

// Glitch effect for loading text
function glitchText() {
    if (!loadingText) return;
    
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const originalText = loadingText.dataset.text || 'LOADING';
    
    // Random glitch
    if (Math.random() > 0.7) {
        let glitched = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.8) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += originalText[i];
            }
        }
        loadingText.textContent = glitched;
        
        setTimeout(() => {
            loadingText.textContent = originalText;
        }, 50);
    }
}

// Start glitch interval
const glitchInterval = setInterval(glitchText, 100);

// Update loading progress
window.updateLoadingProgress = function(percent) {
    if (loadingBar) {
        loadingBar.style.width = percent + '%';
    }
    if (loadingText) {
        loadingText.dataset.text = 'LOADING';
        loadingText.textContent = 'LOADING';
    }
};

// Hide loading screen
window.hideLoadingScreen = function() {
    if (loadingBar) loadingBar.style.width = '100%';
    
    setTimeout(() => {
        clearInterval(glitchInterval);
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 500);
};
