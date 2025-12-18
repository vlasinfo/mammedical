export default function initHeader() {
  gsap.from(".header", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  const burger = document.querySelector(".header__burger");
  const nav = document.querySelector(".header__nav");

  burger.addEventListener("click", () => {
    nav.classList.toggle("active");

    gsap.from(".nav__item", {
      opacity: 0,
      y: -20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
  });

  // Smooth scroll
  const navLinks = document.querySelectorAll(".nav__link");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: targetEl, offsetY: 50 }, // offset optional
          ease: "power2.inOut"
        });
      }

      nav.classList.remove("active");
    });
  });
}
