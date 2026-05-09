/**
 * Premium GSAP ScrollTrigger Animations
 * Requires GSAP and ScrollTrigger loaded via CDN (global variables).
 */
export function initPremiumAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ limitCallbacks: true });

  textSplitReveal();
  cardStaggerReveal();
  timelineItems();
  flowCards();
  demoSteps();
  heroContent();
  sectionSubtitles();
  pageHeroElements();
  heroParallax();
}

/* ------------------------------------------------------------------ */
/*  1. Text Split Reveal                                               */
/* ------------------------------------------------------------------ */
function textSplitReveal() {
  const titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;

  titles.forEach(title => {
    // Skip if already split
    if (title.querySelector('.char')) return;

    const originalHTML = title.innerHTML;
    const words = originalHTML.trim().split(/\s+/);
    const wrapped = words
      .map(word => {
        const chars = word
          .split('')
          .map(ch => `<span class="char">${ch}</span>`)
          .join('');
        return `<span class="word">${chars}</span>`;
      })
      .join(' ');

    title.innerHTML = wrapped;

    gsap.from(title.querySelectorAll('.char'), {
      y: 30,
      opacity: 0,
      stagger: 0.03,
      ease: 'back.out(1.7)',
      duration: 0.8,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/*  2. Card Stagger Reveal                                             */
/* ------------------------------------------------------------------ */
function cardStaggerReveal() {
  const gridSelectors = [
    '.tech-grid',
    '.team-grid',
    '.metrics-grid',
    '.screenshots-grid',
    '.architecture-flow',
  ];

  gridSelectors.forEach(selector => {
    const grids = document.querySelectorAll(selector);
    if (!grids.length) return;

    grids.forEach(grid => {
      const children = grid.children;
      if (!children.length) return;

      gsap.from(children, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/*  3. Timeline Items                                                  */
/* ------------------------------------------------------------------ */
function timelineItems() {
  const items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  gsap.from(items, {
    x: -30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: items[0].parentElement || items[0],
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

/* ------------------------------------------------------------------ */
/*  4. Flow Cards                                                      */
/* ------------------------------------------------------------------ */
function flowCards() {
  const cards = document.querySelectorAll('.flow-card');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 40,
    opacity: 0,
    scale: 0.95,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: cards[0].parentElement || cards[0],
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

/* ------------------------------------------------------------------ */
/*  5. Demo Steps                                                      */
/* ------------------------------------------------------------------ */
function demoSteps() {
  const steps = document.querySelectorAll('.demo-step');
  if (!steps.length) return;

  gsap.from(steps, {
    x: -40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: steps[0].parentElement || steps[0],
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

/* ------------------------------------------------------------------ */
/*  6. Hero Content (home page only)                                   */
/* ------------------------------------------------------------------ */
function heroContent() {
  const body = document.body;
  if (!body || body.dataset.page !== 'home') return;

  const heroEls = [
    '.hero__badge',
    '.hero__subtitle',
    '.hero__tech-pills',
    '.hero__actions',
  ]
    .map(sel => document.querySelector(sel))
    .filter(Boolean);

  if (!heroEls.length) return;

  gsap.from(heroEls, {
    y: (i) => [30, 30, 20, 20][i] || 30,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out',
    delay: 1.8,
  });
}

/* ------------------------------------------------------------------ */
/*  7. Section Subtitles                                               */
/* ------------------------------------------------------------------ */
function sectionSubtitles() {
  const subtitles = document.querySelectorAll('.section__subtitle');
  if (!subtitles.length) return;

  subtitles.forEach(sub => {
    gsap.from(sub, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sub,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/*  8. Page Hero Elements (non-home pages)                             */
/* ------------------------------------------------------------------ */
function pageHeroElements() {
  const body = document.body;
  if (!body || body.dataset.page === 'home') return;

  const pageHeroEls = [
    '.page-hero__title',
    '.page-hero__subtitle',
  ]
    .map(sel => document.querySelector(sel))
    .filter(Boolean);

  if (!pageHeroEls.length) return;

  gsap.from(pageHeroEls, {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.5,
  });
}

/* ------------------------------------------------------------------ */
/*  9. Hero Parallax on Scroll                                         */
/* ------------------------------------------------------------------ */
function heroParallax() {
  const targets = [
    { sel: '.hero__badge', y: -50 },
    { sel: '.hero__title', y: -80 },
    { sel: '.hero__subtitle', y: -120 },
  ];

  targets.forEach(({ sel, y }) => {
    const el = document.querySelector(sel);
    if (!el) return;

    gsap.to(el, {
      y,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}
