import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initCheckUp() {
  gsap.utils.toArray(".card").forEach((card, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
      delay: i * 0.1
    })
    .from(card.querySelector(".card__image img"), {
      scale: 1.1,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.2")
    .from(card.querySelector(".card__title"), {
      y: 20,
      opacity: 0,
      duration: 0.4
    }, "-=0.2")
    .from(card.querySelector(".card__subtitle"), {
      y: 20,
      opacity: 0,
      duration: 0.3
    }, "-=0.2")    
    .from(card.querySelectorAll(".card__tag"), {
      y: 10,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4
    }, "-=0.1")
    .from(card.querySelector(".card__price"), {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.1");
  });

  // Паралакс для зображень
  gsap.to(".card__image img", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".cards",
      scrub: true
    }
  });
}
