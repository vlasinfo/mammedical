gsap.registerPlugin(ScrollTrigger);

export default function initSliderStick(scope = document) {
  const races = document.querySelector(".races");
  const racesWrapper = document.querySelector(".racesWrapper");

  if (!races || !racesWrapper) return;

  // Calculate horizontal scroll distance
  const getScrollAmount = () => -(races.scrollWidth - window.innerWidth);

  // Main horizontal scroll tween
  const racesTween = gsap.to(races, {
    x: getScrollAmount,
    ease: "none",
  });

  // ScrollTrigger for horizontal scroll
  ScrollTrigger.create({
    trigger: racesWrapper,
    start: "top 120px",
    end: () => `+=${-getScrollAmount()}`,
    pin: true,
    animation: racesTween,
    scrub: 1,
    invalidateOnRefresh: true,
    markers: true,
  });

  // ScrollTrigger for Hungary title animation
  const hungary = document.querySelector(".hungary h2");
  if (hungary) {
    gsap.to(hungary, {
      scale: 0.5,
      opacity: 0.5,
      scrollTrigger: {
        trigger: hungary.parentElement, // the .hungary div
        start: () => `left center+=${window.innerWidth / 2}`,
        end: () => `left center`,
        containerAnimation: racesTween,
        scrub: true,
        markers:  ,
      },
    });
  }
}
