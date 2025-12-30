// main.js
import initPreloader from './modules/initPreloader.js';
import initHero from './modules/initHero.js';
import initHeader from './modules/initHeader.js';
import initHover from './modules/initHover.js';
import initScroll from './modules/initScroll.js';
import initScrollSmoother from "./modules/initScrollSmoother.js";

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();

  const onPreloaderFinish = () => {
    initScrollSmoother();
    initHeader();
    initHero();
    initScroll();

    document.removeEventListener('preloaderFinished', onPreloaderFinish);
    document.fonts.ready.then(() => { initHover(".hover-link"); });
  };

  document.addEventListener('preloaderFinished', onPreloaderFinish);
});
