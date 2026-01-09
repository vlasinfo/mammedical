export default function initHeader() {
  gsap.from(".header", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // Hamburger
  const burger = document.querySelector('.header__burger');
  const body = document.body;

  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('opened');
      body.classList.toggle('is-opened', isOpen);

      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute(
        'aria-label',
        isOpen ? 'Close menu' : 'Open menu'
      );
    });
  }

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
