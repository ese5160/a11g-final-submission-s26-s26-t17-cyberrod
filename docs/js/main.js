import { initNavigation } from './components/navigation.js';
import { initPageTransitions, playLoadTransition } from './effects/page-transitions.js';

// Global initialization
initNavigation();
initPageTransitions();

// Page-specific initialization via data-page attribute
const page = document.documentElement.dataset.page;
const isMobile = window.innerWidth < 768;

// Sub-page particle theme map
const pageThemes = {
  architecture: 'architecture',
  hardware: 'hardware',
  software: 'software',
  demo: 'demo',
  team: 'team',
};

// Team email copy buttons (no loader dependency)
if (page === 'team') {
  document.querySelectorAll('.team-card__email').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const ta = Object.assign(document.createElement('textarea'), { value: email });
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      btn.classList.add('team-card__email--copied');
      const copyIcon = btn.querySelector('.team-card__copy-icon');
      if (copyIcon) {
        copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12" stroke="currentColor" fill="none" stroke-width="2"/>';
      }
      setTimeout(() => {
        btn.classList.remove('team-card__email--copied');
        if (copyIcon) {
          copyIcon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" fill="none" stroke="currentColor" stroke-width="2"/>';
        }
      }, 2000);
    });
  });
}

// Premium animations (GSAP ScrollTrigger) - loaded after GSAP CDN is ready
import('./effects/premium-animations.js').then(m => m.initPremiumAnimations()).catch(() => {});

// Custom cursor (desktop only)
import('./effects/custom-cursor.js').then(m => m.initCustomCursor()).catch(() => {});

// Card mouse glow effect
import('./effects/card-glow.js').then(m => m.initCardGlow()).catch(() => {});

// Loader - returns a promise, init page content after it resolves
import('./effects/loader.js').then(m => {
  m.initLoader().then(() => {
    // After loader completes, play page entrance transition then load content
    playLoadTransition();
    if (page === 'home') {
      import('./effects/particles.js').then(p => p.initParticles('home')).catch(() => {});
      import('./components/typewriter.js').then(t => t.initTypewriter()).catch(() => {});
      import('./components/counter.js').then(c => c.initCounters()).catch(() => {});
    }
    // Sub-page particles (desktop only)
    if (!isMobile && pageThemes[page]) {
      import('./effects/particles.js').then(p => p.initParticles(pageThemes[page], '.page-hero__particles')).catch(() => {});
    }
    if (page === 'demo') {
      import('./components/lightbox.js').then(l => l.initLightbox()).catch(() => {});
    }
    if (page === 'hardware') {
      import('./components/carousel.js').then(c => c.initCarousel()).catch(() => {});
    }
  });
}).catch(() => {
  // Loader failed, still load page content
  if (page === 'home') {
    import('./effects/particles.js').then(p => p.initParticles('home')).catch(() => {});
    import('./components/typewriter.js').then(t => t.initTypewriter()).catch(() => {});
    import('./components/counter.js').then(c => c.initCounters()).catch(() => {});
  }
  if (!isMobile && pageThemes[page]) {
    import('./effects/particles.js').then(p => p.initParticles(pageThemes[page], '.page-hero__particles')).catch(() => {});
  }
});
