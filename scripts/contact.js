// Contact section text splitting animation
document.addEventListener('DOMContentLoaded', () => {
    // Wait for SplitText to be available
    if (typeof SplitText !== 'undefined') {
        let split = SplitText.create(".split", {
            type: "chars",
            tag: "span",
            propIndex: true
        });
    } else {
        // Fallback if SplitText is not loaded
        const splitLinks = document.querySelectorAll('.contact-nav a.split');
        
        splitLinks.forEach(link => {
            const text = link.textContent.trim();
            link.textContent = '';
            
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.setProperty('--char', i);
                link.appendChild(span);
            });
        });
    }
});
