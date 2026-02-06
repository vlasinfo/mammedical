import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function initHeader(scope = document) {
  const ctx = gsap.context(() => {

    /* ======================
       Header intro
    ====================== */
    gsap.from(".header", {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    const body = document.body;
    const header = scope.querySelector(".header");
    const burger = scope.querySelector(".header__burger");
    const navMobile = scope.querySelector(".nav--mobile");
    const navItems = navMobile?.querySelectorAll(".nav__item");
    const navLinks = scope.querySelectorAll(".nav__link");

    if (!burger || !navMobile) return;

    /* ======================
       Initial state
    ====================== */
    gsap.set(navMobile, { height: 0, overflow: "hidden" });
    gsap.set(navItems, { opacity: 0, y: 12 });

    navMobile.setAttribute("aria-hidden", "true");

    /* ======================
       Timeline
    ====================== */
    const menuTL = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" }
    });

    menuTL
      .to(navMobile, { height: "auto", duration: 0.4 })
      .to(navItems, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.3
      }, "-=0.2");

    let isOpen = false;
    let lastFocusedEl = null;

    /* ======================
       Focus trap
    ====================== */
    const focusableSelectors = `
      a[href],
      button:not([disabled]),
      input,
      textarea,
      select,
      [tabindex]:not([tabindex="-1"])
    `;

    const getFocusable = () =>
      [...navMobile.querySelectorAll(focusableSelectors)];

    const trapFocus = e => {
      if (!isOpen || e.key !== "Tab") return;

      const focusable = getFocusable();
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

    /* ======================
       Open / Close
    ====================== */
    const openMenu = () => {
      if (isOpen) return;

      isOpen = true;
      lastFocusedEl = document.activeElement;

      body.style.overflow = "hidden";
      burger.classList.add("opened");
      burger.setAttribute("aria-expanded", "true");
      navMobile.setAttribute("aria-hidden", "false");

      menuTL.play();

      getFocusable()[0]?.focus();
      document.addEventListener("keydown", trapFocus);
    };

    const closeMenu = () => {
      if (!isOpen) return;

      isOpen = false;

      body.style.overflow = "";
      burger.classList.remove("opened");
      burger.setAttribute("aria-expanded", "false");
      navMobile.setAttribute("aria-hidden", "true");

      menuTL.reverse();

      document.removeEventListener("keydown", trapFocus);
      lastFocusedEl?.focus();
    };

    /* ======================
       Events
    ====================== */
    burger.addEventListener("click", () => {
      isOpen ? closeMenu() : openMenu();
    });

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

  /* ======================
     Cleanup
  ====================== */
  return () => ctx.revert();
}
