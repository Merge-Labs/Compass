// src/context/ThemeProvider.jsx
import React, { createContext, useEffect, useContext, useMemo } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Force light theme only
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try {
      localStorage.setItem('theme', 'light');
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  const contextValue = useMemo(() => ({ theme: 'light', toggleTheme: () => {} }), []);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};