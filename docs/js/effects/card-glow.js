/**
 * Card Mouse Glow — tracks cursor position for radial glow effect on cards.
 * Throttled via requestAnimationFrame to avoid layout thrashing.
 */
export function initCardGlow() {
  let rafId = null;
  document.addEventListener('mousemove', (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const cards = document.querySelectorAll('.card, .flow-card, .demo-step, .metric-card, .team-card');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      }
      rafId = null;
    });
  }, { passive: true });
}
