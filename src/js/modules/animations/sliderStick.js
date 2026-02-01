import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function initSliderStick(scope = document) {
  const wrapper = scope.querySelector(".slider-stick-wrapper");
  const slides  = gsap.utils.toArray(".slider-stick__slide", scope);

  if (!wrapper || !slides.length) return;

  const mm = gsap.matchMedia();

  /* =========================
     MOBILE — PANEL PIN + SNAP
  ========================= */
  mm.add("(max-width: 766px)", () => {
    const ctx = gsap.context(() => {

      // track panel start positions (for snapping)
      const tops = slides.map(slide =>
        ScrollTrigger.create({
          trigger: slide,
          start: "top top"
        })
      );

      // pin each slide
      slides.forEach(slide => {
        ScrollTrigger.create({
          trigger: slide,
          start: () =>
            slide.offsetHeight < window.innerHeight
              ? "top top"
              : "bottom bottom",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true
        });
      });

      // snap between slides
      ScrollTrigger.create({
        snap: {
          snapTo: (progress, self) => {
            const panelStarts = tops.map(st => st.start);
            const snapScroll = gsap.utils.snap(panelStarts, self.scroll());

            return gsap.utils.normalize(
              0,
              ScrollTrigger.maxScroll(window),
              snapScroll
            );
          },
          duration: 0.5,
          ease: "power1.inOut"
        }
      });

    }, scope);

    return () => ctx.revert();
  });
}
