import gsap from "gsap";

export default function initModal(scope = document) {

  return gsap.context(() => {

    const openBtns = scope.querySelectorAll(".button-open-modal");
    const modal    = scope.querySelector(".modal");
    const overlay  = scope.querySelector(".modal__overlay");
    const windowEl = scope.querySelector(".modal__window");
    const closeBtn = scope.querySelector(".modal__close");
    const modalForm = scope.querySelector(".modal__form");

    if (!openBtns.length || !modal || !overlay || !windowEl) return;

    const formEls = windowEl.querySelectorAll(".is-anitame");

    let scrollY = 0;

    // === BODY LOCK HELPERS ===
    const lockScroll = () => {
      scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    };

    const unlockScroll = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      window.scrollTo(0, scrollY);
    };

    // === MODAL TIMELINE ===
    const modalTl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onStart: () => {
        modal.style.pointerEvents = "auto";
        modal.setAttribute("aria-hidden", "false");
        lockScroll();
      },
      onReverseComplete: () => {
        modal.style.pointerEvents = "none";
        modal.setAttribute("aria-hidden", "true");
        unlockScroll();
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
    const openModal = (e) => {
      e?.preventDefault(); // 🔥 stops scroll-to-top
      if (!modalTl.isActive()) modalTl.play();

      const firstInput = modalForm?.querySelector("#name");
      if (firstInput) {
        setTimeout(() => {
          firstInput.focus({ preventScroll: true });
        }, 600);
      }
    };

    // === CLOSE ===
    const closeModal = () => {
      if (modalTl.progress() > 0) modalTl.reverse();
    };

    openBtns.forEach(btn => {
      btn.addEventListener("click", openModal);
    });

    closeBtn?.addEventListener("click", closeModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // === ESC ===
    const onEsc = (e) => {
      if (e.key === "Escape" && modalTl.progress() > 0) {
        closeModal();
      }
    };

    window.addEventListener("keydown", onEsc);

    // === CLEANUP ===
    return () => {
      window.removeEventListener("keydown", onEsc);
    };

  }, scope);
}
