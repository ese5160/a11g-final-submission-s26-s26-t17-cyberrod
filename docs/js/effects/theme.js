export function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  }

  // Respect system preference if no stored value
  if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
