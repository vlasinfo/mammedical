export default function initAnimations(scope = document) {

  const ctx = gsap.context(() => {

    const title = scope.querySelector('.vi-animate-title');
    if (!title) return;

    const split = new SplitText(title, {
      type: 'chars'
    });

    gsap.from(split.chars, {
      yPercent: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.05,
      delay: 0.6,
      clearProps: 'all'
    });

    // auto-cleanup on context revert
    return () => split.revert();

  }, scope);

  return ctx;
}