export default function initModal(scope = document) {

  return gsap.context(() => {

    const openBtn  = scope.querySelectorAll(".button-open-modal");
    const modal    = scope.querySelector(".modal");
    const overlay  = scope.querySelector(".modal__overlay");
    const windowEl = scope.querySelector(".modal__window");
    const closeBtn = scope.querySelector(".modal__close");
    const modalForm = scope.querySelector(".modal__form");

    if (!openBtn || !modal || !overlay || !windowEl) return;

    const formEls = windowEl.querySelectorAll(".is-anitame");

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

    // === HELPERS ===
    const openModal = () => {
      if (!modalTl.isActive()) modalTl.play();
      // ------------------------
      // Focus на інпут з id="name"
      // ------------------------
      const firstInput = modalForm.querySelector("#name");
      if (firstInput) {
        setTimeout(() => {
          firstInput.focus({ preventScroll: true });
        }, 1000); 
      }
    };

    const closeModal = () => {
      if (modalTl.progress() > 0) modalTl.reverse();
    };

    // === OPEN ===
    if (openBtn.length) { 
      openBtn.forEach(btn => {
        btn.addEventListener("click", openModal);
      });
    }

    // === CLOSE BUTTON ===
    closeBtn?.addEventListener("click", closeModal);

    // === OVERLAY CLICK (close only when clicking overlay itself) ===
    overlay.addEventListener("click", (e) => {
      if (e.currentTarget !== e.target) return;
      closeModal();
    });

    // === ESC KEY ===
    const onEsc = (e) => {
      if (e.key === "Escape" && modalTl.progress() > 0) {
        closeModal();
      }
    };

    window.addEventListener("keydown", onEsc);

    // === CLEANUP (important for SPA / Barba / GSAP context) ===
    return () => {
      window.removeEventListener("keydown", onEsc);
    };

  }, scope);
}
