import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initSliderStick(scope = document) {
  const races = scope.querySelector(".slider-stick");
  const wrapper = scope.querySelector(".slider-stick-wrapper");

  if (!races || !wrapper) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 767px)", () => {
    // GSAP context ensures clean revert
    const ctx = gsap.context(() => {
      const getScrollAmount = () =>
        -(races.scrollWidth - window.innerWidth);

      const tween = gsap.to(races, {
        x: () => getScrollAmount(),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 140px",
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
        markers: false,
      });
    }, scope);

    // Cleanup when media query changes
    return () => ctx.revert();
  });
}
