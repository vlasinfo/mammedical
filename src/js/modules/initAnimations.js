export default function initAnimations(scope = document) {
  return gsap.context(() => {

    /* ======================
      TITLES
    ====================== */
    const titles = scope.querySelectorAll(".vi-animate-title");

    titles.forEach(title => {
      const split = new SplitText(title, { type: "chars" });

      // REVEAL animation
      gsap.from(split.chars, {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
        stagger: 0.05,
        clearProps: "all",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          once: true
        },
        onComplete: () => split.revert()
      });

    });


    /* ======================
      TITLES V2
    ====================== */    

    const titlesV2 = scope.querySelectorAll(".vi-animate-title-v2");

    titlesV2.forEach(title => {
      const splitV2 = new SplitText(title, { type: "chars" });

      gsap.from(splitV2.chars, {
        x: 20,
        autoAlpha: 0,
        duration: 1,
        delay: 0.1,
        ease: "power2.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          once: true
        },
        onComplete: () => splitV2.revert()
      });
    });

    /* ======================
      DESCRIPTIONS
    ====================== */
    const descs = scope.querySelectorAll(".vi-animate-desc");

    gsap.from(descs, {
      y: 100,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.8,
      delay: 1, 
      ease: "power2.out",
      stagger: 0.15,
      clearProps: "all",
      scrollTrigger: {
        trigger: descs,
        start: "top 85%",
        once: true
      }
    });

    /* ======================
       REVEAL BLOCKS
    ====================== */


    // Знаходимо всі елементи з класом .reveal
    let revealContainers = document.querySelectorAll(".reveal");

    // Проходимося по кожному контейнеру
    revealContainers.forEach((container) => {

      // Беремо зображення всередині контейнера
      const image = container.querySelector("img");

      // Створюємо таймлайн GSAP зі ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          // Тригером є сам контейнер
          trigger: container,

          // Анімація стартує, коли верх контейнера доходить до 80% вікна
          start: "top 80%",

          // play — при скролі вниз
          // reverse — при скролі вгору
          toggleActions: "play none none none"
        }
      });

      // Робимо контейнер видимим перед стартом анімації
      // autoAlpha = opacity + visibility
      tl.set(container, { autoAlpha: 1 });

      // Анімація контейнера:
      // виїжджає зліва направо
      tl.from(container, {
        xPercent: -100,        // стартує за межами екрану зліва
        duration: 1.5,         // тривалість анімації
        ease: "power2.out"     // плавне гальмування
      });

      // Анімація картинки всередині контейнера
      tl.from(image, {
        xPercent: 100,         // стартує справа
        scale: 1.3,            // трохи збільшена
        duration: 1.5,
        ease: "power2.out"
      }, "<"); // "<" — стартує одночасно з попередньою анімацією


        /* ======================
          PARALLAX IMAGE
        ====================== */
        gsap.to(image, {
          yPercent: -20,          // глибина паралаксу
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom", // починає рух коли секція з’являється
            end: "bottom top",   // закінчує коли виходить
            scrub: true          // прив’язка до скролу
          }
        });


    });


    



  }, scope);
}


