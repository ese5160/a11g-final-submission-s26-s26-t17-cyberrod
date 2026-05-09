export function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!header) return;

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Active link highlighting (handles both .html and clean URLs)
  const pathEnd = location.pathname.split('/').pop() || 'index.html';
  const currentPage = pathEnd.replace('.html', '') || 'index';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    const hrefClean = href.replace('.html', '').replace('index', 'index');
    if (href === pathEnd || href === currentPage + '.html' || hrefClean === currentPage || (currentPage === 'index' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
