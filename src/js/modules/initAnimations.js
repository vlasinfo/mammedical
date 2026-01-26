export default function initAnimations(scope = document) {
  return gsap.context(() => {

    /* ======================
      TITLES
    ====================== */
    const titles = scope.querySelectorAll(".vi-animate-title");

    titles.forEach(title => {
      const split = new SplitText(title, { type: "chars" });

      // REVEAL animation
      gsap.from(split.chars, {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        delay: 0.4,
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
      TITLES V2
    ====================== */    

    const titlesV2 = scope.querySelectorAll(".vi-animate-title-v2");

    titlesV2.forEach(title => {
      const splitV2 = new SplitText(title, { type: "chars" });

      gsap.from(splitV2.chars, {
        x: 20,
        autoAlpha: 0,
        duration: 1,
        delay: 0.1,
        ease: "power2.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          once: true
        },
        onComplete: () => splitV2.revert()
      });
    });

    /* ======================
      DESCRIPTIONS
    ====================== */
    const descs = scope.querySelectorAll(".vi-animate-desc");

    gsap.from(descs, {
      y: 100,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.8,
      delay: 1, 
      ease: "power2.out",
      stagger: 0.15,
      clearProps: "all",
      scrollTrigger: {
        trigger: descs,
        start: "top 85%",
        once: true
      }
    });

    /* ======================
       REVEAL BLOCKS
    ====================== */
    gsap.utils.toArray(".reveal").forEach(container => {

      const image = container.querySelector("img");
      if (!image) return;

      const tl = gsap.timeline({
        defaults: {
          duration: 1.4,
          ease: "power2.out"
        },
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "top center",
          scrub: true
        }
      });

      tl.set(container, { autoAlpha: 1 });

      tl.from(container, {
        xPercent: -100
      })
      .from(image, {
        xPercent: 100, 
        scale: 1.1
      }, "<"); // sync animations instead of negative delay

    });


  }, scope);
}


