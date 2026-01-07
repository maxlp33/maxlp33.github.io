(() => {
  const track = document.getElementById("track");
  if (!track) return;

  // Function to initialize slider logic
  function initSlider() {
    const wrap = track.parentElement;
    // Re-query cards and dots as they might have been added dynamically
    const cards = Array.from(track.children);
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    const dotsBox = document.getElementById("dots");
    
    // Clear existing dots if any (to avoid duplicates on re-init)
    dotsBox.innerHTML = '';

    const isMobile = () => matchMedia("(max-width:767px)").matches;

    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.onclick = () => activate(i, true);
      dotsBox.appendChild(dot);
    });
    const dots = Array.from(dotsBox.children);

    let current = 0;

    function center(i) {
      const card = cards[i];
      if (!card) return;
      
      // On mobile, we use horizontal scrolling now
      const isMobileView = isMobile();
      
      if (isMobileView) {
        // For mobile, we scroll the track container horizontally
        // Center the selected card in the viewport
        const cardRect = card.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.clientWidth / 2);
        
        track.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      } else {
        // Desktop logic remains similar but uses the wrapper
        const start = card.offsetLeft;
        const size = "clientWidth";
        wrap.scrollTo({
          left: start - (wrap[size] / 2 - card[size] / 2),
          behavior: "smooth",
        });
      }
    }

    function toggleUI(i) {
      cards.forEach((c, k) => c.toggleAttribute("active", k === i));
      dots.forEach((d, k) => d.classList.toggle("active", k === i));
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === cards.length - 1;
    }

    function activate(i, scroll) {
      // Allow re-activation of same index to ensure UI sync
      // if (i === current) return; 
      current = i;
      toggleUI(i);
      if (scroll) center(i);
    }

    function go(step) {
      activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
    }

    // Remove old event listeners to prevent duplicates (simple approach: clone & replace or just re-assign onclick)
    if (prev) prev.onclick = () => go(-1);
    if (next) next.onclick = () => go(1);

    // Note: Global event listeners like keydown/resize might accumulate if initSlider is called multiple times.
    // For this simple refactor, we'll assume initSlider is called once after load.
    // Ideally, we should use named functions for event handlers to remove them.

    cards.forEach((card, i) => {
      card.addEventListener(
        "mouseenter",
        () => matchMedia("(hover:hover)").matches && activate(i, true)
      );
      card.addEventListener("click", () => activate(i, true));
    });

    let sx = 0,
      sy = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        if (isMobile() ? Math.abs(dx) > 40 : Math.abs(dx) > 60)
          go((isMobile() ? dx : dx) > 0 ? -1 : 1);
      },
      { passive: true }
    );
    // Show dots on mobile now that we fixed the layout
    // if (window.matchMedia("(max-width:767px)").matches && dotsBox) dotsBox.hidden = true;

    // We can't easily remove anonymous event listeners for resize/keydown in this structure without refactoring more.
    // But since we only expect one init after load, it's acceptable for now.
    
    toggleUI(0);
    center(0);
    
    // Expose center function for resize event
    window.sliderCenter = () => center(current);
    window.sliderGo = (step) => go(step);
  }

  // Listen for custom event from projects.js
  document.addEventListener('projectsLoaded', initSlider);

  // Also run on load if content is already there (fallback)
  if (track.children.length > 0) {
     // Check if we are waiting for dynamic load (empty track implies waiting)
     // If track has children, maybe they are static or already loaded.
     // But projects.js clears track. So if we run this immediately, we might init on empty or static content.
     // Let's wait for projectsLoaded event primarily.
  }

  addEventListener("resize", () => {
      if (window.sliderCenter) window.sliderCenter();
  });

  addEventListener(
    "keydown",
    (e) => {
      if (window.sliderGo) {
        if (["ArrowRight", "ArrowDown"].includes(e.key)) window.sliderGo(1);
        if (["ArrowLeft", "ArrowUp"].includes(e.key)) window.sliderGo(-1);
      }
    },
    { passive: true }
  );
})();
