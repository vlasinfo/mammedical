// main.js
import initPreloader from      './modules/initPreloader.js';
import initHero from           './modules/initHero.js';
import initHeader from         './modules/initHeader.js';
import initHover from          './modules/initHover.js';
import initScroll from         './modules/initScroll.js';
import initScrollSmoother from './modules/initScrollSmoother.js';
import initButton from         './modules/initButton.js';
import initSnowflake  from     './modules/initSnowflake.js';
import initAnimations from     './modules/initAnimations.js';
import initCircleButton from   './modules/initCircleButton.js';
import initModal from          './modules/initModal.js';
import initFaq from            './modules/initFaq.js';
import initCheckUp from        './modules/initCheckUp.js'; 
import initDoctors from        './modules/initDoctors.js'; 
import initTextReveal from     './modules/animations/textReveal.js';
import initSliderStick from    './modules/animations/sliderStick.js'; 

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initModal();

  document.addEventListener('preloaderFinished', () => {
    initScrollSmoother();
    initHeader();
    initCircleButton();
    initHero(); 
    initScroll();
    initButton();
    initAnimations(); 
    initTextReveal();
    initSliderStick();
    initFaq();
    initCheckUp();
    initDoctors();
    initSnowflake(); // start snowflakes only after preloader





    // hover after fonts are ready
    document.fonts.ready.then(() => { 
      initHover(".hover-link"); 
    });
  }, { once: true });
});

// Later, if you need to stop snowflakes:
// stopSnowflake();
