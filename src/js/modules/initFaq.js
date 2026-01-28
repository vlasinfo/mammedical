import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initFaqAccordion(scope = document) {
  const faq = scope.querySelector(".faq-list");
  if (!faq) return;

  const items = faq.querySelectorAll(".faq-list__item");
  if (!items.length) return;

  /* =========================
     APPEAR FROM BOTTOM
  ========================= */
  gsap.from(items, {
    y: 60,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: faq,
      start: "top 80%",
      once: true
    }
  });

  /* =========================
     ACCORDION
  ========================= */
  items.forEach(item => {
    const button = item.querySelector(".faq-list__question");
    const answer = item.querySelector(".faq-list__answer");
    const icon = item.querySelector(".faq-list__icon svg");

    gsap.set(answer, { height: 0 });
    gsap.set(icon, { rotate: 0 });

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // close all
      items.forEach(i => {
        i.classList.remove("active");
        gsap.to(i.querySelector(".faq-list__answer"), {
          height: 0,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(i.querySelector(".faq-list__icon svg"), {
          rotate: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      // open current
      if (!isOpen) {
        item.classList.add("active");

        gsap.to(answer, {
          height: "auto",
          duration: 0.5,
          ease: "power2.out"
        });

        gsap.to(icon, {
          rotate: 180,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      ScrollTrigger.refresh();
    });
  });

  /* =========================
     HOVER DIM OTHERS
  ========================= */
  const hasHover = window.matchMedia("(hover: hover)").matches;
  if (!hasHover) return;

  items.forEach(item => {
    item.addEventListener("mouseenter", () => {
      items.forEach(i => {
        if (i !== item) {
          gsap.to(i, {
            opacity: 0.4,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(items, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  });


}
