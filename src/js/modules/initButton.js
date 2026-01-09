export default function initButton(scope = document) {
  return gsap.context(() => {

    class ButtonFlair {
      static RANGE = 50;

      constructor(button) {
        this.button = button;
        this.flair = button.querySelector('.button__flair');
        if (!this.flair) return;

        this.last = { x: 0, y: 0 };
        this.bounds = null;

        this.setupGSAP();
        this.bindEvents();
      }

      setupGSAP() {
        this.setX = gsap.quickSetter(this.flair, 'xPercent');
        this.setY = gsap.quickSetter(this.flair, 'yPercent');

        const opts = { duration: 0.6, ease: 'power2.out' };
        this.moveX = gsap.quickTo(this.flair, 'xPercent', opts);
        this.moveY = gsap.quickTo(this.flair, 'yPercent', opts);

        // Hide flair initially
        gsap.set(this.flair, { scale: 0 });
      }

      updateBounds() {
        const { left, top, width, height } =
          this.button.getBoundingClientRect();

        this.bounds = { left, top, width, height };

        const r = ButtonFlair.RANGE;

        this.mapX = gsap.utils.pipe(
          gsap.utils.mapRange(0, width, -r, r),
          gsap.utils.clamp(-r, r)
        );

        this.mapY = gsap.utils.pipe(
          gsap.utils.mapRange(0, height, -r, r),
          gsap.utils.clamp(-r, r)
        );
      }

      getTouchPosition(e) {
        if (!e.touches || !e.touches[0]) return this.last;

        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        return {
          x: this.mapX(clientX - this.bounds.left),
          y: this.mapY(clientY - this.bounds.top)
        };
      }

      onEnter = (e) => {
        this.updateBounds();

        const pos = this.getTouchPosition(e);
        this.last = pos;

        this.setX(pos.x);
        this.setY(pos.y);

        gsap.to(this.flair, {
          scale: 1,
          duration: 0.4,
          color: 'white',
          ease: 'power2.out'
        });

        // Animate button text color to white
        gsap.to(this.button, {
          duration: 0.3, 
          ease: 'power2.out'
        });
      };

      onMove = (e) => {
        const pos = this.getTouchPosition(e);
        this.last = pos;

        this.moveX(pos.x);
        this.moveY(pos.y);
      };

      onLeave = () => {
        gsap.to(this.flair, {
          xPercent: this.last.x * 1.4,
          yPercent: this.last.y * 1.4,
          scale: 0,
          duration: 0.5,
          ease: 'power2.out'
        });

        // Reset button text color back to original (inherit)
        gsap.to(this.button, {
          color: '',
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      bindEvents() {
        // Touch-only events
        this.button.addEventListener('touchstart', this.onEnter, { passive: true });
        this.button.addEventListener('touchmove', this.onMove, { passive: true });
        this.button.addEventListener('touchend', this.onLeave);
        this.button.addEventListener('touchcancel', this.onLeave);
      }
    }

    gsap.utils.toArray('.button', scope)
      .forEach(el => new ButtonFlair(el));

  }, scope);
}
