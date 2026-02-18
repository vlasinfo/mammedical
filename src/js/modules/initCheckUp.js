import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initCheckUp() {
  gsap.utils.toArray(".card").forEach((card, i) => {
    const image = card.querySelector(".card__image img");
    const title = card.querySelector(".card__title");
    const subtitle = card.querySelector(".card__subtitle");
    const tags = card.querySelectorAll(".card__tag");
    const price = card.querySelector(".card__price");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      defaults: {
        ease: "power3.out",
        duration: 0.6
      }
    });

    tl.from(card, {
      opacity: 0,
      y: 50,
      delay: i * 0.1
    })
    .from(image, {
      scale: 1.1,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.2")
    .from(title, { y: 20, opacity: 0 }, "-=0.2")
    .from(subtitle, { y: 20, opacity: 0, duration: 0.4 }, "-=0.2")
    .from(tags, {
      y: 10,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4
    }, "-=0.1")
    .from(price, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.1");
  });

  // Optimized parallax effect
  ScrollTrigger.batch(".card__image img", {
    onEnter: batch => {
      gsap.to(batch, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".card",
          scrub: true
        }
      });
    }
  });
}
