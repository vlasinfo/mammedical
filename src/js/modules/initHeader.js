export default function initHeader(scope = document) {

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

  if (!burger || !navMobile) return;

  // Initial state
  gsap.set(navMobile, { height: 0, overflow: "hidden" });
  gsap.set(navItems, { opacity: 0, y: 12 });

  // Timeline
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

  burger.addEventListener("click", () => {
    isOpen ? menuTL.reverse() : menuTL.play();
    isOpen = !isOpen;

    body.classList.toggle("is-opened", isOpen);
    burger.classList.toggle("opened", isOpen);

    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  // Smooth scroll + close menu
  const navLinks = scope.querySelectorAll(".nav__link");

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

      if (isOpen) {
        menuTL.reverse();
        isOpen = false;
        body.classList.remove("is-opened");
        burger.classList.remove("opened");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  });
}
