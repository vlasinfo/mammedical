import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

export default function hoverNav(selector = ".hover-link") {
  const links = document.querySelectorAll(selector);

  links.forEach(link => {
    const initial = link.querySelector(".initial");
    const hover = link.querySelector(".hover");

    if (!initial || !hover) return;
    if (link.dataset.hoverInit) return;
    link.dataset.hoverInit = "true";

    const splitInitial = new SplitText(initial, { type: "chars" });
    const splitHover = new SplitText(hover, { type: "chars" });

    gsap.set(splitInitial.chars, { yPercent: 0 });
    gsap.set(splitHover.chars, { yPercent: 100 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });

    tl.to(splitInitial.chars, {
      yPercent: -100,
      duration: 0.6,
      stagger: { each: 0.02, from: "start" }
    })
    .to(splitHover.chars, {
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02, from: "start" }
    }, 0.05);

    link._hoverTl = tl;

    // Hover/focus events
    link.addEventListener("mouseenter", () => tl.play());
    link.addEventListener("mouseleave", () => tl.reverse());
    link.addEventListener("focus", () => tl.play());
    link.addEventListener("blur", () => tl.reverse());

    // Smooth scroll on click
    const targetId = link.getAttribute("href")?.replace("#", "");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      link.addEventListener("click", e => {
        e.preventDefault();
        gsap.to(window, {
          duration: 2.2,
          ease: "power2.inOut",
          scrollTo: { y: targetSection, offsetY: 0 }
        });
      });

      // Active state based on section visibility
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              link.classList.add("active");
              tl.play();
            } else {
              link.classList.remove("active");
              tl.reverse();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(targetSection);
    }
  });
}
