export default function initAnimations(scope = document) {
  return gsap.context(() => {

    /* ======================
      TITLES
    ====================== */
    const titles = scope.querySelectorAll(".vi-animate-title");

    titles.forEach(title => {
      const split = new SplitText(title, { type: "chars" });

      gsap.from(split.chars, {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.05,
        clearProps: "all",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          once: true
        },
        onComplete: () => split.revert()
      });
    });

    /* ======================
      DESCRIPTIONS
    ====================== */
    const descs = scope.querySelectorAll(".vi-animate-desc");

    gsap.from(descs, {
      y: 20,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
      clearProps: "all",
      scrollTrigger: {
        trigger: descs,
        start: "top 85%",
        once: true
      }
    });

  }, scope);
}
