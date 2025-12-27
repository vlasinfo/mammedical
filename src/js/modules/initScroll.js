export default function initScroll() {
  const scroll_class = 'is-scrolled';
  const scroll_offset = 10;

  const onScroll = () => {
    document.body.classList.toggle(
      scroll_class,
      window.scrollY > scroll_offset
    );
  };

  // Run on load (important for refresh on scrolled page)
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
}
