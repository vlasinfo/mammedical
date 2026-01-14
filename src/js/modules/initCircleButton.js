export default function initCircleButton(scope = document) {

  // GSAP context — автоматично прибере всі анімації при destroy / повторній ініціалізації
  return gsap.context(() => {

    // === MAIN BUTTON ===
    // Головна CTA-кнопка в hero
    const btn = scope.querySelector(".hero-cta");
    if (!btn) return;

    // Візуальні елементи кнопки
    const wave = btn.querySelector(".hero-cta__wave");       // хвиля / ripple ефект
    const gradient = btn.querySelector(".hero-cta__gradient"); // фон з градієнтом
    const textEl = btn.querySelector(".hero-cta__text");     // текст кнопки

    // === SPLITTEXT ===
    // Розбиваємо текст на слова і символи для анімацій
    // chars → для micro-motion
    // words → якщо захочеш пізніше анімувати словами
    const split = new SplitText(textEl, {
      type: "words,chars",
      charsClass: "char",
      wordsClass: "word"
    });

    // === IDLE GRADIENT ROTATION ===
    // Повільне нескінченне обертання градієнта
    // Працює завжди, навіть без взаємодії
    gsap.to(gradient, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    // === HERO ENTRANCE (ScrollTrigger) ===
    // Поява кнопки при скролі до hero
    gsap.from(btn, {
      scale: 0.6,
      delay: 1.2,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: btn,
        start: "top 80%",
        once: true
      }
    });

    // Анімація тексту синхронно з кнопкою
    gsap.from(split.chars, {
      y: 16,
      opacity: 0,
      stagger: 0.02,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: btn,
        start: "top 80%",
        once: true
      }
    });

    // === HOVER TIMELINE ===
    // Таймлайн hover-ефектів
    // paused — запускається тільки при наведенні
    const hoverTl = gsap.timeline({ paused: true });

    hoverTl
      // Активуємо хвилю
      .to(wave, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })

      // Плаваюча хвиля (loop)
      .to(wave, {
        y: "-=40",
        scale: 1.25,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Мікропідйом символів
      .to(split.chars, {
        y: -4,
        stagger: 0.01,
        duration: 0.3,
        ease: "power2.out"
      }, 0)

      // Трохи розтягуємо текст
      .to(textEl, {
        letterSpacing: "0.04em",
        duration: 0.3
      }, 0);

    // Hover events
    btn.addEventListener("mouseenter", () => hoverTl.play());
    btn.addEventListener("mouseleave", () => hoverTl.reverse());

    // === MAGNETIC HOVER (DESKTOP ONLY) ===
    // Магнітний ефект — кнопка тягнеться до курсора
    if (matchMedia("(hover: hover)").matches) {

      btn.addEventListener("mousemove", (e) => {

        // Визначаємо центр кнопки
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;

        // Рухаємо саму кнопку
        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.4,
          ease: "power3.out"
        });

        // Текст рухається слабше → depth effect
        gsap.to(textEl, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.4,
          ease: "power3.out"
        });
      });

      // Плавне повернення в центр
      btn.addEventListener("mouseleave", () => {
        gsap.to([btn, textEl], {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.4)"
        });
      });
    }

    // === CLICK IMPULSE ===
    // Тактильний click feedback
    btn.addEventListener("click", () => {

      // Стиснення кнопки
      gsap.fromTo(btn,
        { scale: 1 },
        {
          scale: 0.92,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut"
        }
      );

      // Ripple-хвиля
      gsap.fromTo(wave,
        { scale: 0.7, opacity: 0.6 },
        {
          scale: 1.8,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );

      // 👉 тут логічно відкривати модальне вікно / форму
      // openBookingModal();
    });

    // === AUTO-PULSE (ATTENTION HOOK) ===
    // Легке "дихання" кнопки після паузи
    // Працює як conversion hook
    gsap.to(btn, {
      scale: 1.05,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 5
    });

  }, scope);
}
