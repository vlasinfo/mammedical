import Lenis from '@studio-freight/lenis';

export default function initScrollSmoother() {
  const lenis = new Lenis({
    duration: 1,
    easing: (t) => t * (2 - t),
    smooth: true,
    direction: 'vertical',
    mouseMultiplier: 1,   // keep multiplier low for natural feel
    smoothTouch: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // FAQ accordion example
  const faq = document.querySelector(".faq-list");
  if (faq) {
    faq.addEventListener("click", () => {
      // wait for accordion animation, then refresh scroll bounds
      setTimeout(() => {
        if (typeof lenis.resize === "function") {
          lenis.resize();
        } else {
          lenis.update(); // fallback for older versions
        }
      }, 500);
    });
  }

  // Optional: automatic refresh for any dynamic height
  const main = document.querySelector("main");
  if (main) {
    new ResizeObserver(() => {
      if (typeof lenis.resize === "function") {
        lenis.resize();
      } else {
        lenis.update();
      }
    }).observe(main);
  }

  return lenis;
}
