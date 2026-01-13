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
      delay: 0.4,
      clearProps: 'all'
    });

        /* ======================
      DESCRIPTION
    ====================== */
    const descs = scope.querySelectorAll('.vi-animate-desc');

    gsap.from(descs, {
      y: 20,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.8,
      ease: 'power2.out',
      delay: 1,
      stagger: 0.15,
      clearProps: 'all'
    });

    // auto-cleanup on context revert
    return () => split.revert();

  }, scope);

  return ctx;
}