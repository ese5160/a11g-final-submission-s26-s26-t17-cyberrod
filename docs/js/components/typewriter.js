export function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const fullText = el.textContent.trim();
  el.textContent = '';
  el.classList.add('tw-ready');

  // Create cursor element
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:3px;height:1em;background:#6DAE45;margin-left:2px;vertical-align:text-bottom;animation:cursorBlink 1s step-end infinite;';
  el.appendChild(cursor);

  // Inject cursor blink keyframe if not present
  if (!document.getElementById('tw-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'tw-cursor-style';
    style.textContent = '@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(style);
  }

  let i = 0;
  const baseSpeed = 70;
  const variation = 40;
  const startDelay = 2000;

  function type() {
    if (i < fullText.length) {
      // Insert character before cursor
      const char = document.createTextNode(fullText.charAt(i));
      el.insertBefore(char, cursor);
      i++;
      const speed = baseSpeed + (Math.random() - 0.5) * variation;
      setTimeout(type, speed);
    } else {
      // Remove cursor after a delay
      setTimeout(() => {
        cursor.style.transition = 'opacity 0.5s';
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 500);
      }, 2000);
    }
  }

  setTimeout(type, startDelay);
}
