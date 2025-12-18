// main.js
import initPreloader from './modules/initPreloader.js';
import initHero from './modules/initHero.js';
import initHeader from './modules/initHeader.js';
import initHover from './modules/initHover.js';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();

  // Make sure hero + header run only once
  const onPreloaderFinish = () => {
    initHeader();
    initHero();
    initHover(".hover-link");

    // Remove listener after it fires once
    document.removeEventListener('preloaderFinished', onPreloaderFinish);
  };

  document.addEventListener('preloaderFinished', onPreloaderFinish);
});
