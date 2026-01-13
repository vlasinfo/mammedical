// Snowflake.stop();
import initPreloader from      './modules/initPreloader.js';
import initHero from           './modules/initHero.js';
import initHeader from         './modules/initHeader.js';
import initHover from          './modules/initHover.js';
import initScroll from         './modules/initScroll.js';
import initScrollSmoother from './modules/initScrollSmoother.js';
import initButton from         './modules/initButton.js';
import initSnowflake from      './modules/initSnowflake.js';
import initAnimations from     './modules/initAnimations.js';
import initCircleButton from     './modules/initCircleButton.js';
import initModal from     './modules/initModal.js';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initModal();
  const onPreloaderFinish = () => {
    initScrollSmoother();
    initHeader();
    initCircleButton();
    initHero();
    initScroll();
    initButton();
    initAnimations(); 
    initSnowflake(); // сніг запускаємо ТІЛЬКИ після прелоадера

    document.removeEventListener('preloaderFinished', onPreloaderFinish);

    // hover після font ready
    document.fonts.ready.then(() => { 
      initHover(".hover-link"); 
    });
  };

  document.addEventListener('preloaderFinished', onPreloaderFinish);
});
