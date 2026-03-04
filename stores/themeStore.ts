// stores/themeStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'ramadhan-mode-storage' });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemePreference;
  systemTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set, get) => ({
      theme: 'dark',
      systemTheme: 'dark',

      setTheme: (theme) => set((s) => { s.theme = theme; }),

      setSystemTheme: (systemTheme) => set((s) => { s.systemTheme = systemTheme; }),

      toggleTheme: () => set((s) => {
        const current = s.theme === 'system' ? s.systemTheme : s.theme;
        s.theme = current === 'dark' ? 'light' : 'dark';
      }),
    })),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
