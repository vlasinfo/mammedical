export default function initHover(selector = ".hover-link", scrollOffset = 300) {
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
    console.error('GSAP and SplitText are required for initHover to work');
    return;
  }

  const links = document.querySelectorAll(selector);
  if (!links.length) return;

  let activeLink = null;
  const timelines = new Map();
  const splitTextInstances = new Map();

  const clearActive = () => {
    links.forEach(l => {
      l.classList.remove("active");
      const tl = timelines.get(l);
      if (tl) {
        tl.timeScale(1).reverse();
      }
    });
    activeLink = null;
  };

  const setActive = (link) => {
    clearActive();
    link.classList.add("active");
    activeLink = link;
    const tl = timelines.get(link);
    if (tl) {
      tl.timeScale(1).play();
    }
  };

  const setActiveFromURL = () => {
    const currentURL = window.location.href.replace(/\/$/, "");
    const currentPath = window.location.pathname.replace(/\/$/, "");

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.startsWith("javascript:")) continue;

      try {
        const linkURL = new URL(href, window.location.origin).href.replace(/\/$/, "");
        if (linkURL === currentURL) {
          setActive(link);
          return;
        }
      } catch {
        if (currentURL.endsWith(href)) {
          setActive(link);
          return;
        }
      }

      if (href === currentPath || 
          (currentPath && currentPath.endsWith(href)) ||
          (href !== '/' && currentPath.includes(href))) {
        setActive(link);
        return;
      }
    }
  };

  const isTouchDevice = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  const isTouch = isTouchDevice();

  const cleanupSplitText = (link) => {
    const splits = splitTextInstances.get(link);
    if (splits) {
      splits.forEach(split => split.revert && split.revert());
      splitTextInstances.delete(link);
    }
  };

  links.forEach(link => {
    cleanupSplitText(link);

    const initial = link.querySelector(".initial");
    const hover = link.querySelector(".hover");

    if (!initial || !hover) {
      console.warn('Link missing .initial or .hover elements:', link);
      return;
    }

    try {
      const splitInitial = new SplitText(initial, { type: "chars", charsClass: "char-initial" });
      const splitHover = new SplitText(hover, { type: "chars", charsClass: "char-hover" });

      splitTextInstances.set(link, [splitInitial, splitHover]);

      gsap.set(splitInitial.chars, { yPercent: 0, display: "inline-block" });
      gsap.set(splitHover.chars, { yPercent: 100, display: "inline-block" });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });
      tl.to(splitInitial.chars, { yPercent: -100, duration: 0.6, stagger: 0.02 })
        .to(splitHover.chars,   { yPercent: 0, duration: 0.6, stagger: 0.02 }, 0.05);

      timelines.set(link, tl);

      if (!isTouch) {
        const playAnimation = () => { if (link !== activeLink) tl.timeScale(1).play(); };
        const reverseAnimation = () => { if (link !== activeLink) tl.timeScale(1).reverse(); };

        link.addEventListener("mouseenter", playAnimation);
        link.addEventListener("mouseleave", reverseAnimation);
        link.addEventListener("focus", playAnimation);
        link.addEventListener("blur", reverseAnimation);

        link._hoverHandlers = { mouseenter: playAnimation, mouseleave: reverseAnimation, focus: playAnimation, blur: reverseAnimation };
      }

      const clickHandler = (e) => {
        const href = link.getAttribute("href");

        if (href === "#" || href?.startsWith("javascript:")) {
          e.preventDefault();
        } else if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const targetPos = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
            // Use GSAP ScrollToPlugin if available
            if (gsap.plugins && gsap.plugins.scrollTo) {
              gsap.to(window, { duration: 1, scrollTo: targetPos, ease: "power2.out" });
            } else {
              window.scrollTo({ top: targetPos, behavior: "smooth" });
            }
          }
        }

        setActive(link);
      };

      link.addEventListener("click", clickHandler);
      link._clickHandler = clickHandler;

      link.dataset.hoverInit = "true";
    } catch (error) {
      console.error('Error initializing hover effect for link:', link, error);
    }
  });

  setActiveFromURL();
  window.addEventListener('popstate', setActiveFromURL);

  return () => {
    links.forEach(link => {
      if (link._hoverHandlers) {
        Object.entries(link._hoverHandlers).forEach(([event, handler]) => {
          link.removeEventListener(event, handler);
        });
        delete link._hoverHandlers;
      }
      if (link._clickHandler) {
        link.removeEventListener("click", link._clickHandler);
        delete link._clickHandler;
      }
      cleanupSplitText(link);
      delete link.dataset.hoverInit;
    });
    timelines.clear();
    splitTextInstances.clear();
    window.removeEventListener('popstate', setActiveFromURL);
  };
}

// Initialize safely
const initWhenReady = () => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.finally(() => setTimeout(() => initHover(), 500));
  } else {
    setTimeout(() => initHover(), 300);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  initWhenReady();
}
