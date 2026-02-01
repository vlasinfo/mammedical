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
     FAQ ACCORDION (MULTI-OPEN)
  ========================= */
  items.forEach(item => {
    const button = item.querySelector(".faq-list__question");
    const answer = item.querySelector(".faq-list__answer");
    const icon = item.querySelector(".faq-list__icon svg");

    // Initial state
    gsap.set(answer, { height: 0 });
    gsap.set(icon, { rotate: 0 });

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      /* ---------
         TOGGLE CURRENT ITEM ONLY
      --------- */
      if (isOpen) {
        // Close
        item.classList.remove("active");

        gsap.to(answer, {
          height: 0,
          duration: 0.4,
          ease: "power2.out"
        });

        gsap.to(icon, {
          rotate: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        // Open
        item.classList.add("active");

        gsap.to(answer, {
          height: "auto",
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            // Update ScrollTrigger after height change
            ScrollTrigger.refresh();
          }
        });

        gsap.to(icon, {
          rotate: 180,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });

  /* =========================
     HOVER DIM OTHERS (FAQ)
  ========================= */
  if (!window.matchMedia("(hover: hover)").matches) return;

  items.forEach(item => {
    item.addEventListener("mouseenter", () => {
      items.forEach(i => {
        if (i !== item) {
          gsap.to(i, {
            opacity: 0.2,
            duration: 0.8,
            zIndex: 0,
            ease: "power2.out"
          });
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(items, {
        opacity: 1,
        duration: 0.8,
        zIndex: 1,
        ease: "power2.out"
      });
    });
  });
}
