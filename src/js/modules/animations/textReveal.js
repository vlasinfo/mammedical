gsap.registerPlugin(ScrollTrigger);

export default function initTextReveal(scope = document) {
  // Automatically split all text-split elements inside scope
  const textBlocks = scope.querySelectorAll(".text-split");

  textBlocks.forEach(el => {
    const isLetters = el.classList.contains("letters-fade-in");
    new SplitType(el, {
      types: isLetters ? "chars" : "words",
      tagName: "span"
    });
  });

  // Reusable scroll animation
  const animateText = (el) => {
    if (!el) return;

    const isWordsSlide = el.classList.contains("words-slide-from-left");
    const isLettersFade = el.classList.contains("letters-fade-in");
    const isScrub = el.classList.contains("scrub-each-word");

    let targets;
    let tl;

    if (isWordsSlide) {
      targets = el.querySelectorAll(".word");
      tl = gsap.timeline({ paused: true });
      tl.from(targets, {
        opacity: 0,
        x: "-1em",
        duration: 0.6,
        ease: "power2.out",
        stagger: { amount: 0.2 }
      });
    }

    if (isLettersFade) {
      targets = el.querySelectorAll(".char");
      tl = gsap.timeline({ paused: true });
      tl.from(targets, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
        stagger: { amount: 0.8 }
      });
    }

    if (isScrub) {
      targets = el.querySelectorAll(".word");
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "center center",
          scrub: true
        }
      }).from(targets, {
        opacity: 0.2,
        duration: 0.5,
        ease: "power1.out",
        stagger: { each: 0.4 }
      });
      return;
    }

    // Normal scroll triggers for paused timelines
    if (tl) {
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        onLeaveBack: () => {
          tl.progress(0);
          tl.pause();
        }
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        onEnter: () => tl.play()
      });
    }
  };

  // Apply animations to all text blocks
  textBlocks.forEach(el => animateText(el));

  // Show text to prevent FOUC
  gsap.set(textBlocks, { opacity: 1 });
}
