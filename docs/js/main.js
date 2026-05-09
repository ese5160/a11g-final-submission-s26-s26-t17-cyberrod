import { initNavigation } from './components/navigation.js';
import { initScrollAnimations } from './effects/scroll-animations.js';
import { initTheme } from './effects/theme.js';
import { initParallax } from './effects/parallax.js';
import { initSmoothScroll } from './effects/smooth-scroll.js';
import { initPageTransitions, playLoadTransition } from './effects/page-transitions.js';

// Global initialization
initNavigation();
initScrollAnimations();
initTheme();
initParallax();
initSmoothScroll();
initPageTransitions();

// Page-specific initialization via data-page attribute
const page = document.documentElement.dataset.page || document.body.dataset.page;

// Premium animations (GSAP ScrollTrigger) - loaded after GSAP CDN is ready
import('./effects/premium-animations.js').then(m => m.initPremiumAnimations()).catch(() => {});

// Custom cursor (desktop only)
import('./effects/custom-cursor.js').then(m => m.initCustomCursor()).catch(() => {});

// Loader - returns a promise, init page content after it resolves
import('./effects/loader.js').then(m => {
  m.initLoader().then(() => {
    // After loader completes, play page entrance transition then load content
    playLoadTransition();
    if (page === 'home') {
      import('./effects/particles.js').then(p => p.initParticles()).catch(() => {});
      import('./components/typewriter.js').then(t => t.initTypewriter()).catch(() => {});
    }
    if (page === 'demo') {
      import('./components/lightbox.js').then(l => l.initLightbox()).catch(() => {});
    }
    if (page === 'hardware') {
      import('./components/carousel.js').then(c => c.initCarousel()).catch(() => {});
    }
    if (page === 'home') {
      import('./components/counter.js').then(c => c.initCounters()).catch(() => {});
    }
  });
}).catch(() => {
  // Loader failed, still load page content
  if (page === 'home') {
    import('./effects/particles.js').then(p => p.initParticles()).catch(() => {});
    import('./components/typewriter.js').then(t => t.initTypewriter()).catch(() => {});
    import('./components/counter.js').then(c => c.initCounters()).catch(() => {});
  }
});
