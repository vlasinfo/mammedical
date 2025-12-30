export default function initScrollSmoother() {
  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,           // scroll animation duration (seconds)
    easing: (t) => t * (2 - t), // easing curve
    smooth: true,            // enable smooth scrolling
    direction: 'vertical',   // vertical scroll
    mouseMultiplier: 1,      // scroll speed with mouse
    smoothTouch: true        // enable smooth scrolling on touch devices
  });

  // Animation loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Optional: smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target);
    });
  });

  return lenis; // return instance if you need to control it later
}
