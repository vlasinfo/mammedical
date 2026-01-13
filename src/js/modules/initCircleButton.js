export default function initCircleButton(scope = document) {

return gsap.context(() => {

    const btn = scope.querySelector(".hero-cta");
    if (!btn) return;

    const wave = btn.querySelector(".hero-cta__wave");
    const gradient = btn.querySelector(".hero-cta__gradient");
    const textEl = btn.querySelector(".hero-cta__text");

    // === SplitText ===
    const split = new SplitText(textEl, {
      type: "words,chars",
      charsClass: "char",
      wordsClass: "word"
    });

    // === Idle gradient rotation ===
    gsap.to(gradient, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    // === HERO ENTRANCE (ScrollTrigger) ===
    gsap.from(btn, {
      scale: 0.6,
      delay: 1.2,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: btn,
        start: "top 80%",
        once: true
      }
    });

    gsap.from(split.chars, {
      y: 16,
      opacity: 0,
      stagger: 0.02,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: btn,
        start: "top 80%",
        once: true
      }
    });

    // === Hover timeline ===
    const hoverTl = gsap.timeline({ paused: true });

    hoverTl
      .to(wave, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
      .to(wave, {
        y: "-=40",
        scale: 1.25,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      .to(split.chars, {
        y: -4,
        stagger: 0.01,
        duration: 0.3,
        ease: "power2.out"
      }, 0)
      .to(textEl, {
        letterSpacing: "0.04em",
        duration: 0.3
      }, 0);

    btn.addEventListener("mouseenter", () => hoverTl.play());
    btn.addEventListener("mouseleave", () => hoverTl.reverse());

    // === Magnetic hover (desktop only) ===
    if (matchMedia("(hover: hover)").matches) {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;

        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.4,
          ease: "power3.out"
        });

        gsap.to(textEl, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.4,
          ease: "power3.out"
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to([btn, textEl], {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.4)"
        });
      });
    }

    // === Click impulse ===
    btn.addEventListener("click", () => {
      gsap.fromTo(btn,
        { scale: 1 },
        {
          scale: 0.92,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut"
        }
      );

      gsap.fromTo(wave,
        { scale: 0.7, opacity: 0.6 },
        {
          scale: 1.8,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );

      // 👉 тут можна відкривати modal / form
      // openBookingModal();
    });

    // === Auto-pulse (attention hook) ===
    gsap.to(btn, {
      scale: 1.05,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 5
    });

  }, scope);
}