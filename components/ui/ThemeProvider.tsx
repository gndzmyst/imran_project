// components/ui/ThemeProvider.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';
import { Colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  isDark: true,
  colors: Colors.dark,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useThemeStore();
  const systemScheme = useColorScheme();
  const activeTheme: ThemeMode = theme === 'system'
    ? (systemScheme ?? 'dark')
    : theme;

  const value = useMemo<ThemeContextValue>(() => ({
    theme: activeTheme,
    isDark: activeTheme === 'dark',
    colors: activeTheme === 'dark' ? Colors.dark : Colors.light,
    toggleTheme,
  }), [activeTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
