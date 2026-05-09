/**
 * Smooth scroll initialization.
 * Lenis removed for performance — native scroll is sufficient and avoids
 * the per-frame JS overhead that caused jank on this site.
 * GSAP ScrollTrigger works directly with native scroll events.
 */
export function initSmoothScroll() {
  // Native smooth scroll is handled by CSS scroll-behavior: smooth
  // GSAP ScrollTrigger auto-detects native scroll — no manual syncing needed
}
