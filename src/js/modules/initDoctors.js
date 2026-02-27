gsap.registerPlugin(ScrollTrigger);

export default function initDoctors(selector = ".doctors") {
  const el = document.querySelector(selector);
  if (!el) return;

  const swiper = new Swiper(el, {
    slidesPerView: 1, // mobile default
    spaceBetween: 20,
    speed: 600,
    allowTouchMove: true,

    breakpoints: {
      768: {
        slidesPerView: "auto",
        allowTouchMove: false,
      }
    }
  });

  function updateByProgress(progress) {
    progress = Math.max(0, Math.min(1, progress));

    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;

    swiper.setTranslate(current);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {

    const tween = gsap.to({}, {
      scrollTrigger: {
        trigger: el,
        start: "center center",
        end: () => "+=" + el.offsetWidth * 2.5,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: self => updateByProgress(self.progress),
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      swiper.setTranslate(0);
      swiper.update();
    };
  });

  return swiper;
}