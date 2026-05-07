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

  // Active link highlighting
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
