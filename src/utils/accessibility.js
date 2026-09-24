/**
 * StockPilot Accessibility Helpers
 */

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }
}

export function applyFontSize(size) {
  const root = document.documentElement;
  root.classList.remove('font-size-large', 'font-size-xlarge');

  if (size === 'large' || size === 'grande') {
    root.classList.add('font-size-large');
  } else if (size === 'xlarge' || size === 'muy grande' || size === 'muy_grande') {
    root.classList.add('font-size-xlarge');
  }
}

export function applyAccessibilityPreferences(prefs = {}) {
  const root = document.documentElement;
  
  if (prefs.dyslexiaFont) {
    root.setAttribute('data-dyslexia', 'true');
  } else {
    root.removeAttribute('data-dyslexia');
  }

  if (prefs.reducedMotion) {
    root.setAttribute('data-reduced-motion', 'true');
  } else {
    root.removeAttribute('data-reduced-motion');
  }

  if (prefs.colorFilter && prefs.colorFilter !== 'none') {
    root.setAttribute('data-color-filter', prefs.colorFilter);
  } else {
    root.removeAttribute('data-color-filter');
  }
}

export function announceToScreenReader(message) {
  const region = document.getElementById('sr-announcements');
  if (region) {
    region.textContent = message;
  }
}
