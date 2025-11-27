// 🌟 ENHANCED VISUAL INTERACTIONS 🌟

document.addEventListener('DOMContentLoaded', function() {
    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add scroll reveal classes to elements
    const projectCards = document.querySelectorAll('.project-card');
    const skillItems = document.querySelectorAll('.skill-item');
    const sectionTitles = document.querySelectorAll('.section-title');

    projectCards.forEach((card, index) => {
        card.classList.add('scroll-reveal');
        observer.observe(card);
        
        // Staggered animation delay
        card.style.transitionDelay = `${index * 0.2}s`;
    });

    skillItems.forEach((skill, index) => {
        if (index % 2 === 0) {
            skill.classList.add('scroll-reveal-left');
        } else {
            skill.classList.add('scroll-reveal-right');
        }
        observer.observe(skill);
        skill.style.transitionDelay = `${index * 0.1}s`;
    });

    sectionTitles.forEach(title => {
        title.classList.add('scroll-reveal');
        observer.observe(title);
    });

    // Enhanced navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add enhanced glow effect based on scroll
        if (scrollTop > 100) {
            navbar.style.setProperty('--glow-intensity', '0.8');
            navbar.classList.add('scrolled');
        } else {
            navbar.style.setProperty('--glow-intensity', '0.4');
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Enhanced particle clicks with color variations
    document.addEventListener('click', function(e) {
        createEnhancedSparks(e.clientX, e.clientY);
    });

    function createEnhancedSparks(x, y) {
        const colors = ['rgba(255, 255, 255, 0.6)', 'rgba(229, 229, 229, 0.5)', 'rgba(74, 158, 255, 0.4)'];
        const sparkCount = 6;
        
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'enhanced-spark';
            
            const angle = (i / sparkCount) * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            spark.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${1 + Math.random() * 2}px;
                height: ${1 + Math.random() * 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                --end-x: ${endX}px;
                --end-y: ${endY}px;
                animation: enhancedSparkBurst 1s ease-out forwards;
            `;
            
            document.body.appendChild(spark);
            
            setTimeout(() => {
                spark.remove();
            }, 1000);
        }
    }

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 30px rgba(74, 158, 255, 0.4)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Enhanced hover effects for project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect to neighboring cards
            const allCards = Array.from(projectCards);
            const currentIndex = allCards.indexOf(this);
            
            allCards.forEach((otherCard, index) => {
                if (Math.abs(index - currentIndex) === 1) {
                    otherCard.style.filter = 'brightness(1.1)';
                    otherCard.style.transform = 'translateY(-4px)';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            projectCards.forEach(otherCard => {
                otherCard.style.filter = '';
                otherCard.style.transform = '';
            });
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.transform = `translateY(${scrolled * -0.1}px)`;
        }
    });

    // Dynamic gradient shifts for enhanced visual appeal
    setInterval(() => {
        const hero = document.querySelector('.hero');
        const randomHue1 = Math.floor(Math.random() * 60) + 200; // Blue range
        const randomHue2 = Math.floor(Math.random() * 60) + 280; // Purple range
        
        hero.style.setProperty('--dynamic-color1', `hsl(${randomHue1}, 70%, 50%)`);
        hero.style.setProperty('--dynamic-color2', `hsl(${randomHue2}, 70%, 50%)`);
    }, 8000);

    // Enhanced logo cube interaction
    const logoCube = document.querySelector('.logo-cube');
    if (logoCube) {
        logoCube.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 25px rgba(74, 158, 255, 0.8))';
            this.style.animation = 'logoCubeRotate 1s infinite linear';
        });
        
        logoCube.addEventListener('mouseleave', function() {
            this.style.filter = '';
            this.style.animation = 'logoCubeRotate 8s infinite linear';
        });
    }
});

// CSS for enhanced spark animation
const enhancedSparkCSS = `
@keyframes enhancedSparkBurst {
    0% {
        opacity: 0.8;
        transform: scale(1) translate(0, 0);
    }
    20% {
        opacity: 0.6;
        transform: scale(0.9) translate(calc(var(--end-x) * 0.3), calc(var(--end-y) * 0.3));
    }
    60% {
        opacity: 0.3;
        transform: scale(0.6) translate(calc(var(--end-x) * 0.8), calc(var(--end-y) * 0.8));
    }
    100% {
        opacity: 0;
        transform: scale(0.3) translate(var(--end-x), var(--end-y));
    }
}

.enhanced-spark {
    animation: enhancedSparkBurst 1s ease-out forwards !important;
}
`;

// Add enhanced spark CSS
const style = document.createElement('style');
style.textContent = enhancedSparkCSS;
document.head.appendChild(style);