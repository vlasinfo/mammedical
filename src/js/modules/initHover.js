export default function initHover(selector = ".hover-link") {
  const links = document.querySelectorAll(selector);
  if (!links.length) return;

  links.forEach(link => {
    const initial = link.querySelector(".initial");
    const hover = link.querySelector(".hover");

    if (!initial || !hover) return;
    if (link.dataset.hoverInit) return;
    link.dataset.hoverInit = "true";

    const splitInitial = new SplitText(initial, { type: "chars" });
    const splitHover   = new SplitText(hover,   { type: "chars" });

    gsap.set(splitInitial.chars, { yPercent: 0 });
    gsap.set(splitHover.chars,   { yPercent: 100 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut" }
    });

    tl.to(splitInitial.chars, {
      yPercent: -100,
      duration: 0.6,
      stagger: { each: 0.02 }
    })
    .to(splitHover.chars, {
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 }
    }, 0.05);

    link.addEventListener("mouseenter", () => tl.play());
    link.addEventListener("mouseleave", () => tl.reverse());
    link.addEventListener("focus", () => tl.play());
    link.addEventListener("blur", () => tl.reverse());
  });
}

// Call only after fonts are ready
document.fonts.ready.then(() => { setTimeout(() => initHover(), 100); });
