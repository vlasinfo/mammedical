gsap.registerPlugin(ScrollTrigger);

export default function initHero() {

  const mediaWrap = document.querySelectorAll(".vi-hero");

  mediaWrap.forEach((media, i) => {
    const mediaImgs = media.querySelectorAll(".vi-hero__image picture");

    mediaImgs.forEach((img) => {
      const parent = img.parentElement;
      const heightDiff = img.offsetHeight - parent.offsetHeight;
      const parallaxComp = 140;

      // Smooth appear animation
      gsap.from(img, {
        opacity: 0,
        scale: 1.25,
        y: 60,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: media,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });

      // Parallax animation
      gsap.to(parent, {
        y: -heightDiff + parallaxComp,
        scale: 1.25,
        scrollTrigger: {
          trigger: media,
          start: "top top",
          scrub: 1,
        }
      });
    });
  });

}
