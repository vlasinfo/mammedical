import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initTeam() {
  const swiper = new Swiper(".swiper", {
    // Core settings
    loop: true,                // infinite loop
    speed: 600,                // transition speed in ms
    slidesPerView: 1,          // one slide visible at a time
    spaceBetween: 30,          // gap between slides

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // Pagination bullets
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Responsive breakpoints
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  });

  const currentSlide = document.querySelector(".current-slide");

  swiper.on("slideChange", () => {
    const active = swiper.slides[swiper.activeIndex];
    const prev = swiper.slides[swiper.previousIndex];

    if (currentSlide) {
      currentSlide.textContent = swiper.realIndex + 1; // use realIndex for looped sliders
    }

    // Animate previous slide out
    gsap.to(prev, {
      opacity: 0.3,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });

    // Animate active slide in
    gsap.to(active, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });

    // Spin number inside active slide
    const numberEl = active.querySelector("div");
    if (numberEl) {
      gsap.to(numberEl, {
        rotation: "+=360",
        duration: 0.8,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
    }
  });
}
