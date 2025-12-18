// modules/preloader.js
export default function initPreloader() {

  document.documentElement.classList.add('is-loading');

  const viPreloaderText = document.querySelectorAll('.vi-preloader__slide');
  const viPreloaderElement = document.querySelector('.vi-preloader__logo');
  const viPreloader = document.querySelector('.vi-preloader');
  const viPreloaderBar = document.querySelector('.vi-preloader__bar');

  let gsapReady = false;
  let paceReady = false;

  // Letter spacing adjusted per screen
  const getLetterSpacing = () => {
    const w = window.innerWidth;
    if (w >= 1025) return "10px";
    if (w >= 768) return "5px";
    return "2px";
  };

  /* ============================
       GSAP TEXT + LOGO TIMELINE
     ============================ */

  const tl = gsap.timeline({
    onComplete: () => {
      gsapReady = true;
      tryFinishPreloader();
    }
  });

  viPreloaderText.forEach((el) => {
    tl.to(el, {
      onStart: () => (el.style.display = "block"),
      letterSpacing: getLetterSpacing(),
      duration: 1,
      ease: CustomEase.create(
        "textEase",
        "M0,0 C0,0 0,1.018 0.497,1.019 1,1.019 1,0 1,1"
      ),
      onComplete: () => (el.style.display = "none")
    });
  });

  tl.from(viPreloaderElement, {
    onStart: () => (viPreloaderElement.style.display = "block"),
    scale: 0,
    duration: 0.5,
    ease: CustomEase.create(
      "logoEase",
      "M0,0 C0.098,0.247 0.298,1.49 1,0.9"
    )
  });

  /* ============================
         PACE.JS PROGRESS SYNC
     ============================ */

  Pace.on("progress", (percent) => {
    const txt = document.querySelector(".vi-preloader__progress");
    if (txt) txt.textContent = `${Math.floor(percent)}%`;
    if (viPreloaderBar) viPreloaderBar.style.width = `${percent}%`;
  });

  Pace.on("done", () => {
    paceReady = true;
    tryFinishPreloader();
  });

  /* ============================
        FINAL PRELOADER HIDE
     ============================ */

  function tryFinishPreloader() {
    if (!gsapReady || !paceReady) return;

    gsap.to(viPreloader, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 1,
      ease: "power4.out",
      onComplete: () => {
        viPreloader.style.display = "none";
        document.documentElement.classList.remove("is-loading");

        // Fire only ONCE — hero, header, everything waits for this
        document.dispatchEvent(new Event("preloaderFinished"));
      }
    });
  }
}
