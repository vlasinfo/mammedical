export default function initHeader(scope = document) {
  const ctx = gsap.context(() => {

    // Header intro
    gsap.from(".header", {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    const body = document.body;
    const burger = scope.querySelector(".header__burger");
    const navMobile = scope.querySelector(".nav--mobile");
    const navItems = navMobile?.querySelectorAll(".nav__item");
    const navLinks = scope.querySelectorAll(".nav__link");
    const openBtn = scope.querySelector(".hero-cta");

    if (!burger || !navMobile) return;

    // --------------------
    // Initial state
    // --------------------
    gsap.set(navMobile, {
      height: 0,
      overflow: "hidden"
    });

    gsap.set(navItems, {
      opacity: 0,
      y: 12
    });

    navMobile.setAttribute("aria-hidden", "true");
    navMobile.setAttribute("aria-modal", "true");

    // --------------------
    // Timeline
    // --------------------
    const menuTL = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" }
    });

    menuTL
      .to(navMobile, {
        height: "auto",
        duration: 0.4
      })
      .to(navItems, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.3
      }, "-=0.2");

    let isOpen = false;
    let lastFocusedEl = null;

    // --------------------
    // Focus trap helpers
    // --------------------
    const focusableSelectors = `
      a[href],
      button:not([disabled]),
      textarea,
      input,
      select,
      [tabindex]:not([tabindex="-1"])
    `;

    const getFocusableEls = () =>
      [...navMobile.querySelectorAll(focusableSelectors)];

    const trapFocus = e => {
      if (!isOpen || e.key !== "Tab") return;

      const focusable = getFocusableEls();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // --------------------
    // Open / Close helpers
    // --------------------
    const openMenu = () => {
      if (isOpen) return;

      lastFocusedEl = document.activeElement;
      isOpen = true;

      body.classList.add("is-opened");
      body.style.overflow = "hidden";

      burger.classList.add("opened");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Close menu");

      navMobile.setAttribute("aria-hidden", "false");

      menuTL.play();

      const focusable = getFocusableEls();
      focusable[0]?.focus();

      document.addEventListener("keydown", trapFocus);
    };

    const closeMenu = () => {
      if (!isOpen) return;

      isOpen = false;

      body.classList.remove("is-opened");
      body.style.overflow = "";

      burger.classList.remove("opened");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");

      navMobile.setAttribute("aria-hidden", "true");

      menuTL.reverse();

      document.removeEventListener("keydown", trapFocus);
      lastFocusedEl?.focus();
    };

    // --------------------
    // Events
    // --------------------
    burger.addEventListener("click", () => {
      isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const targetEl = document.querySelector(targetId);

        if (targetEl) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: targetEl, offsetY: 50 },
            ease: "power2.inOut"
          });
        }

        closeMenu();
      });
    });

    openBtn?.addEventListener("click", closeMenu);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", e => {
      if (
        isOpen &&
        !navMobile.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        closeMenu();
      }
    });

  }, scope);

  // --------------------
  // Cleanup (GSAP context)
  // --------------------
  return () => ctx.revert();
}
