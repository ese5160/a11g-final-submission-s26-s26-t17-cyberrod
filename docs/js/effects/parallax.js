export function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}
