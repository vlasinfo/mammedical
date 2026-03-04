import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";

gsap.registerPlugin(ScrollTrigger);

export default function initDoctors(selector = ".doctors-pin") {
  const el = document.querySelector(selector);
  const slider = document.querySelector(".doctors");
  if (!el || !slider) return;

  // Factory function for Swiper
  const createSwiper = () =>
    new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 0,
      allowTouchMove: true,
      breakpoints: {
        768: {
          slidesPerView: "auto",
          allowTouchMove: false,
        },
      },
    });

  let swiper = createSwiper();

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
    swiper.update();

    const st = ScrollTrigger.create({
      trigger: el,
      start: "center center",
      end: () => "+=" + el.scrollWidth * 2.5,
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateByProgress(self.progress),
    });

    // Cleanup when leaving breakpoint
    return () => {
      st.kill();
      swiper.setTranslate(0);
      swiper.update();
    };
  });

  // Handle resize safely
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (swiper && !swiper.destroyed) {
        swiper.destroy(true, true);
      }
      swiper = createSwiper();
      ScrollTrigger.refresh();
    }, 200);
  });

  return swiper;
}
