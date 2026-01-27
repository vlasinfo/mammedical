gsap.registerPlugin(ScrollTrigger);

export default function initSliderStick(scope = document) {
  const races = scope.querySelector(".slider-stick");
  const racesWrapper = scope.querySelector(".slider-stick-wrapper");

  if (!races || !racesWrapper) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 767px)", () => {
 
    const getScrollAmount = () =>
      -(races.scrollWidth - window.innerWidth);

    const racesTween = gsap.to(races, {
      x: getScrollAmount,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 140px",
      end: () => `+=${-getScrollAmount()}`,
      pin: true,
      animation: racesTween,
      scrub: 1,
      invalidateOnRefresh: true,
      markers: true,
    });

    // cleanup on breakpoint change
    return () => {
      racesTween.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  });
}
