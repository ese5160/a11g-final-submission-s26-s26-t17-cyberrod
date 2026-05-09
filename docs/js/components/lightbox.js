export function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length) return;

  let overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
      <button class="lightbox-next" aria-label="Next">&#10095;</button>
      <div class="lightbox-content"></div>
    `;
    document.body.appendChild(overlay);
  }

  const content = overlay.querySelector('.lightbox-content');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  let currentIndex = 0;

  function show(index) {
    const trigger = triggers[index];
    const imgSrc = trigger.getAttribute('href') || trigger.dataset.lightbox;
    content.innerHTML = `<img src="${imgSrc}" alt="Lightbox image">`;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentIndex = index;
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger, i) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show((currentIndex - 1 + triggers.length) % triggers.length));
  nextBtn.addEventListener('click', () => show((currentIndex + 1) % triggers.length));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}
