import { useState, useEffect, useCallback } from 'react';

interface DarkModeReturn {
  isDark: boolean;
  toggle: () => void;
}

export function useDarkMode(): DarkModeReturn {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('trafficiq-dark-mode');
      if (stored !== null) return stored === 'true';
    } catch {

      // localStorage not available
    }return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('trafficiq-dark-mode', String(isDark));
    } catch {

      // localStorage not available
    }}, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle };
}