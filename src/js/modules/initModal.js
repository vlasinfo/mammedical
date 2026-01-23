export default function initModal(scope = document) {

  return gsap.context(() => {

    const openBtn = scope.querySelector(".hero-cta");
    const modal = scope.querySelector(".modal");
    const overlay = scope.querySelector(".modal__overlay");
    const windowEl = scope.querySelector(".modal__window");
    const closeBtn = scope.querySelector(".modal__close");
    const formEls = windowEl.querySelectorAll("input, button");

    if (!openBtn || !modal) return;

    // === MODAL TIMELINE ===
    const modalTl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onStart: () => {
        modal.style.pointerEvents = "auto";
        modal.setAttribute("aria-hidden", "false");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      },
      onReverseComplete: () => {
        modal.style.pointerEvents = "none";
        modal.setAttribute("aria-hidden", "true");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    });

    modalTl
      .to(overlay, {
        opacity: 1,
        backdropFilter: "blur(6px)",
        duration: 0.4
      })
      .to(windowEl, {
        opacity: 1,
        scale: 1,
        duration: 0.5
      }, "-=0.2")
      .from(formEls, {
        y: 16,
        opacity: 0,
        stagger: 0.06,
        duration: 0.4
      }, "-=0.2");

    // === OPEN ===
    openBtn.addEventListener("click", () => {
      modalTl.play();
    });

    // === CLOSE ===
    [overlay, closeBtn].forEach(el => {
      el.addEventListener("click", () => {
        modalTl.reverse();
      });
    });

    // === ESC KEY ===
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalTl.isActive()) {
        modalTl.reverse();
      }
    });

  }, scope);
}
