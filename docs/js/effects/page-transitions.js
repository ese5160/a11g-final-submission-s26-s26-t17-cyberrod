/**
 * Page Transition System — GPU-composited opacity/transform transitions.
 * Replaces clip-path circle (which forces repaints every frame).
 */

const SESSION_FLAG = 'cyberrod-transitioning';

export function playLoadTransition() {
  if (!sessionStorage.getItem(SESSION_FLAG)) return;
  sessionStorage.removeItem(SESSION_FLAG);
  if (typeof gsap === 'undefined') return;

  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:10001;background:#040c1e;opacity:1;pointer-events:none;will-change:opacity;';
  document.body.appendChild(overlay);

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => overlay.remove(),
  });
}

function interceptLinkClicks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('javascript')
    ) return;

    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    e.preventDefault();

    if (typeof gsap === 'undefined') {
      window.location.href = href;
      return;
    }

    sessionStorage.setItem(SESSION_FLAG, 'true');

    const main = document.querySelector('main');
    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; },
    });

    if (main) {
      tl.to(main, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        ease: 'power2.in',
      }, 0);
    }

    // Use opacity fade instead of clip-path (GPU-composited)
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:10001;background:#040c1e;opacity:0;pointer-events:none;will-change:opacity;';
    document.body.appendChild(overlay);

    tl.to(overlay, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.inOut',
    }, 0);
  });
}

export function initPageTransitions() {
  interceptLinkClicks();
}
