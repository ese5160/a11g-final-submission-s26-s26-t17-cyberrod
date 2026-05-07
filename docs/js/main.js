import { initNavigation } from './components/navigation.js';
import { initScrollAnimations } from './effects/scroll-animations.js';
import { initTheme } from './effects/theme.js';
import { initParallax } from './effects/parallax.js';

// Global initialization
initNavigation();
initScrollAnimations();
initTheme();

// Page-specific initialization via data-page attribute
const page = document.body.dataset.page;

if (page === 'home') {
  import('./effects/particles.js').then(m => m.initParticles()).catch(() => {});
  import('./components/typewriter.js').then(m => m.initTypewriter()).catch(() => {});
  import('./components/counter.js').then(m => m.initCounters()).catch(() => {});
}
if (page === 'demo') {
  import('./components/lightbox.js').then(m => m.initLightbox()).catch(() => {});
}
if (page === 'hardware') {
  import('./components/carousel.js').then(m => m.initCarousel()).catch(() => {});
}
