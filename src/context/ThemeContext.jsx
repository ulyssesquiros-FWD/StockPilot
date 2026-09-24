import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme, applyFontSize, applyAccessibilityPreferences } from '../utils/accessibility';

export const ThemeContext = createContext(null);

const THEME_KEY = 'stockpilot_theme';
const FONT_SIZE_KEY = 'stockpilot_font_size';
const A11Y_PREFS_KEY = 'stockpilot_a11y_prefs';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem(FONT_SIZE_KEY) || 'normal';
  });

  const [a11yPrefs, setA11yPrefsState] = useState(() => {
    try {
      const stored = localStorage.getItem(A11Y_PREFS_KEY);
      return stored ? JSON.parse(stored) : { dyslexiaFont: false, reducedMotion: false, colorFilter: 'none' };
    } catch {
      return { dyslexiaFont: false, reducedMotion: false, colorFilter: 'none' };
    }
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  useEffect(() => {
    applyAccessibilityPreferences(a11yPrefs);
    localStorage.setItem(A11Y_PREFS_KEY, JSON.stringify(a11yPrefs));
  }, [a11yPrefs]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setFontSize = (size) => {
    setFontSizeState(size);
  };

  const setA11yPrefs = (updates) => {
    setA11yPrefsState(prev => ({ ...prev, ...updates }));
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    fontSize,
    setFontSize,
    a11yPrefs,
    setA11yPrefs
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
