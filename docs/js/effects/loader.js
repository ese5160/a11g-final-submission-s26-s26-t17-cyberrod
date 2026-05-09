/**
 * Premium Loader — Scale + Blur reveal with accent glow, seamless dissolve
 * Total duration: ~2.5s. No progress bar, no slide-up.
 */
export function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;

  const logo = loader.querySelector('.loader__logo');
  const logoText = loader.querySelector('.loader__logo-text');
  const glow = loader.querySelector('.loader__glow');

  return new Promise((resolve) => {
    if (typeof gsap === 'undefined') {
      loader.style.display = 'none';
      resolve();
      return;
    }

    const tl = gsap.timeline({ onComplete: resolve });

    // Initial state: logo small, blurred, invisible
    gsap.set(logo, { scale: 0.3, opacity: 0, filter: 'blur(20px)' });
    if (logoText) gsap.set(logoText, { opacity: 0, y: 10, letterSpacing: '0.3em' });

    // Phase 1: Logo scales in from blur (0s – 1.0s)
    tl.to(logo, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.0,
      ease: 'power3.out',
    });

    // Phase 2: Text reveals with letter-spacing tighten (0.4s – 1.0s)
    if (logoText) {
      tl.to(logoText, {
        opacity: 1,
        y: 0,
        letterSpacing: '-0.02em',
        duration: 0.6,
        ease: 'power3.out',
      }, 0.4);
    }

    // Phase 3: Accent glow pulse behind logo (0.3s – 1.4s)
    if (glow) {
      gsap.set(glow, { scale: 0.5, opacity: 0 });
      tl.to(glow, {
        scale: 1.2,
        opacity: 0.5,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.3);
      tl.to(glow, {
        scale: 2.0,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
      }, 0.9);
    }

    // Phase 4: Hold (logo visible, still) — gap built into timeline

    // Phase 5: Dissolve entire loader to transparent (1.6s – 2.4s)
    tl.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 1.6);

    // Phase 6: Remove from DOM
    tl.set(loader, { display: 'none' });
  });
}
