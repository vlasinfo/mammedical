
gsap.registerPlugin(ScrollTrigger);

export default function initDoctors(selector = ".doctors") {
  const el = document.querySelector(selector);
  if (!el) return;

  const swiper = new Swiper(el, {
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 600,
    allowTouchMove: false, // important for scroll control
  });

  // map scroll progress → swiper translate
  function updateByProgress(progress) {
    progress = Math.max(0, Math.min(1, progress));

    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;

    swiper.setTranslate(current);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  // GSAP scroll control
  gsap.to({}, {
    scrollTrigger: {
      trigger: el,
      start: "center center",
      end: () => "+=" + el.offsetWidth,
      scrub: true,
      pin: true,
      onUpdate: self => updateByProgress(self.progress),
    }
  });

  return swiper;
}