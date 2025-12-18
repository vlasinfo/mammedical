export default function hoverNav(selector = ".hover-link") {
  const links = document.querySelectorAll(selector);

  links.forEach(link => {
    const initial = link.querySelector(".initial");
    const hover = link.querySelector(".hover");

    if (!initial || !hover) return;

    // Prevent duplicate setups if re-initialized
    if (link.dataset.hoverInit) return;
    link.dataset.hoverInit = "true";

    // Split into characters
    const splitInitial = new SplitText(initial, { type: "chars" });
    const splitHover = new SplitText(hover, { type: "chars" });

    // Position hover text below initial, then animate up to overlap
    gsap.set(splitInitial.chars, { yPercent: 0 });
    gsap.set(splitHover.chars, { yPercent: 100 });

    // Build timeline
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
    }, 0.05)

    // Store and wire events
    link._hoverTl = tl;

    link.addEventListener("mouseenter", () => {
      tl.play();
    });

    link.addEventListener("mouseleave", () => {
      tl.reverse();
    });

    // Optional: prevent mid-animation stacking glitches on rapid reentry
    link.addEventListener("focus", () => tl.play());
    link.addEventListener("blur", () => tl.reverse());
  });
}
