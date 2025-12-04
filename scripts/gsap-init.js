// GSAP animation setup - zoom through text to reveal hero

window.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap) return;

  const initAfterFonts = () => {
    gsap.registerPlugin(ScrollTrigger);

    const navbar = document.querySelector('.navbar');
    const splashOverlay = document.querySelector('.splash-overlay');
    const splashText = document.querySelector('.splash-text');
    const textOverlayContainer = document.querySelector('.text-overlay-container');
    const textFill = document.querySelector('.text-fill');

    // Ensure initial state - text visible, overlay visible
    gsap.set(textFill, { opacity: 1 });
    gsap.set(splashOverlay, { autoAlpha: 1 });
    // Set transform origin to center on the text (slightly left of center since text is there)
    gsap.set(splashText, { scale: 1, x: 0, transformOrigin: '48.5% 50%' });
    gsap.set(textOverlayContainer, { scale: 1, x: 0, transformOrigin: '48.5% 50%' });
    gsap.set(navbar, { autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    })
    // Phase 1: Fade cream text to 0 FIRST - reveals the text-shaped hole
    .to(textFill, {
      opacity: 0,
      duration: 0.15
    })
    // Phase 2: THEN zoom both the SVG mask and text container together
    .to([splashText, textOverlayContainer], {
      scale: 25,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.15)
    // Phase 3: Fade out the entire overlay when zoomed big enough
    .to(splashOverlay, {
      autoAlpha: 0,
      duration: 0.08
    }, 0.45)
    // Show navbar
    .to(navbar, {
      autoAlpha: 1,
      pointerEvents: 'auto',
      duration: 0.05
    }, 0.55);

    window.addEventListener('resize', () => {
      heightRatio = window.innerWidth / window.innerHeight;
    });

    // About Section - Smooth reveal from bottom with mask effect
    gsap.from('.about-container', {
      opacity: 0,
      y: 100,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    });

    // About section parallax - subtle float effect
    gsap.to('.about-container', {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Skills animate in with stagger
    gsap.from('.skill-item', {
      opacity: 0,
      y: 30,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.skills',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Projects Section - Smooth reveal with scale
    gsap.from('.projects-container', {
      opacity: 0,
      y: 100,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projects-slider',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        toggleActions: 'play none none none'
      }
    });

    // Contact Section - Smooth reveal with scale
    gsap.from('.contact-container', {
      opacity: 0,
      y: 100,
      scale: 0.95,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        toggleActions: 'play none none none'
      }
    });

    // Section titles: reveal from bottom with slight scale
    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.from(title, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.to('.eye', {
      y: 3,
      duration: 1.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initAfterFonts);
  } else {
    initAfterFonts();
  }
});
