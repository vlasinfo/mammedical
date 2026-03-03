gsap.registerPlugin(ScrollTrigger);

export default function initDoctors(selector = ".vi-doctors") {
  const el = document.querySelector(selector);
  const slider = document.querySelector('.doctors');
  if (!el || !slider) return;

  const swiper = new Swiper(slider, {
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 600,
    allowTouchMove: true,
    observer: true,
    observeParents: true,

    breakpoints: {
      768: {
        slidesPerView: "auto",
        allowTouchMove: false,
      }
    }
  });

  function updateByProgress(progress) {
    progress = gsap.utils.clamp(0, 1, progress);

    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;

    swiper.setTranslate(current);
    swiper.updateProgress(current);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {

    // Important: update swiper before measuring
    swiper.update();

    const st = ScrollTrigger.create({
      trigger: el,
      start: "center center",
      end: () => "+=" + slider.scrollWidth,
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: self => updateByProgress(self.progress),
    });

    // VERY important for resize
    ScrollTrigger.refresh();

    return () => {
      st.kill(true);

      swiper.setTranslate(0);
      swiper.update();
    };
  });

  // Global resize safety
  window.addEventListener("resize", () => {
    swiper.update();
    ScrollTrigger.refresh();
  });

  return swiper;
}