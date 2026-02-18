import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";

gsap.registerPlugin(ScrollTrigger);

export default function initDoctors() {
  const el = document.querySelector('.doctors-swiper');
  if (!el) return;

  const swiper = new Swiper(el, {
    speed: 0,
    allowTouchMove: false,
  });

  const slides = swiper.slides.length;
  let lastIndex = -1;

  ScrollTrigger.create({
    trigger: '.vi-doctors',
    start: 'top top',
    end: `+=${slides * 100}%`,
    pin: true,
    scrub: 1,

    snap: {
      snapTo: 1 / (slides - 1),
      duration: 0.4,
      ease: 'power1.inOut'
    },

    onUpdate: (self) => {
      const index = Math.round(self.progress * (slides - 1));
      if (index !== lastIndex) {
        swiper.slideTo(index, 0);
        lastIndex = index;
      }
    }
  });
}
