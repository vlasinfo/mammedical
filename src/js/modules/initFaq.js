import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function initFaqAccordion(scope = document) {
  const faq = scope.querySelector(".faq-list");
  if (!faq) return;

  const items = gsap.utils.toArray(".faq-list__item", faq);
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     APPEAR ON SCROLL
  ========================= */
  if (!reduceMotion) {
    gsap.from(items, {
      y: 48,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: faq,
        start: "top 80%",
        once: true
      }
    });
  }

  /* =========================
     ACCORDION SETUP
  ========================= */
  const accordions = items.map(item => {
  const answer = item.querySelector(".faq-list__answer");
  const button = item.querySelector(".faq-list__text");
  const icon   = item.querySelector(".faq-list__icon svg");

  // initial collapsed state
  gsap.set(answer, { height: 0, overflow: "hidden" });

  const tl = gsap.timeline({ paused: true })
    .to(answer, {
      height: "auto",
      duration: 0.45,
      ease: "power2.out"
    }, 0);

  if (icon) {
    tl.to(icon, { rotate: 180, duration: 0.3, ease: "power2.out" }, 0);
  }

  return { item, button, answer, tl };
  });

  let activeItem = null;

  /* =========================
     CLICK HANDLER
  ========================= */
  faq.addEventListener("click", e => {
    const question = e.target.closest(".faq-list__question");
    if (!question) return;

    const item = question.closest(".faq-list__item");
    const current = accordions.find(a => a.item === item);
    if (!current) return;

    const isOpen = item.classList.contains("active");

    // close active item
    if (activeItem && activeItem !== current) {
      closeAccordion(activeItem);
    }

    if (isOpen) {
      closeAccordion(current);
      activeItem = null;
    } else {
      openAccordion(current);
      activeItem = current;
    }
  });

  /* =========================
     HOVER DIM (DESKTOP ONLY)
  ========================= */
  if (window.matchMedia("(hover: hover)").matches) {
    items.forEach(item => {
      item.addEventListener("mouseenter", () => {
        gsap.to(items.filter(i => i !== item), { opacity: 0.3, duration: 0.25 });
      });
      item.addEventListener("mouseleave", () => {
        gsap.to(items, { opacity: 1, duration: 0.25 });
      });
    });
  }

  /* =========================
     HELPERS
  ========================= */
function closeAccordion(acc) {
  acc.item.classList.remove("active");
  acc.button.setAttribute("aria-expanded", "false");
  acc.answer.setAttribute("aria-hidden", "true");
  acc.tl.reverse();
}

function openAccordion(acc) {
  acc.item.classList.add("active");
  acc.button.setAttribute("aria-expanded", "true");
  acc.answer.setAttribute("aria-hidden", "false");
  acc.tl.play();
}

}

/* =========================
   SMART SCROLL HELPER
========================= */
function smartScrollTo(element, offset = 80) {
  const rect = element.getBoundingClientRect();
  const isVisible = rect.top >= offset && rect.bottom <= window.innerHeight - offset;
  if (isVisible) return;

  const y = window.scrollY + rect.top - offset;
  gsap.to(window, { scrollTo: y, duration: 0.5, ease: "power2.out" });
}
