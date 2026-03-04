// stores/ibadahStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { MMKV } from 'react-native-mmkv';
import { format } from 'date-fns';

const storage = new MMKV({ id: 'ramadhan-mode-storage' });
const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export interface IbadahItem {
  id: string;
  name: string;
  nameId: string;
  category: 'SHOLAT' | 'QURAN' | 'CHARITY' | 'DZIKIR' | 'OTHER';
  icon: string;
  isDaily: boolean;
  isNumeric: boolean;
  unit?: string;
  value: boolean | number;
  completedAt?: string;
}

interface IbadahState {
  ibadahItems: IbadahItem[];
  logs: Record<string, IbadahItem[]>;  // date string -> items
  todayStreak: number;
  todayCompletion: number;

  toggleIbadah: (id: string) => void;
  updateNumericIbadah: (id: string, value: number) => void;
  getTodayItems: () => IbadahItem[];
  calculateStreak: () => void;
}

const DEFAULT_ITEMS: IbadahItem[] = [
  { id: '1', name: 'Fajr', nameId: 'Subuh',    category: 'SHOLAT', icon: '🌙', isDaily: true, isNumeric: false, value: false },
  { id: '2', name: 'Dhuhr', nameId: 'Dzuhur',  category: 'SHOLAT', icon: '☀️', isDaily: true, isNumeric: false, value: false },
  { id: '3', name: 'Asr', nameId: 'Ashar',      category: 'SHOLAT', icon: '🌤️', isDaily: true, isNumeric: false, value: false },
  { id: '4', name: 'Maghrib', nameId: 'Maghrib',category: 'SHOLAT', icon: '🌆', isDaily: true, isNumeric: false, value: false },
  { id: '5', name: 'Isha', nameId: 'Isya',      category: 'SHOLAT', icon: '🌃', isDaily: true, isNumeric: false, value: false },
  { id: '6', name: 'Tarawih', nameId: 'Tarawih',category: 'SHOLAT', icon: '🕌', isDaily: true, isNumeric: false, value: false },
  { id: '7', name: 'Tilawah', nameId: 'Tilawah',category: 'QURAN',  icon: '📖', isDaily: true, isNumeric: true, unit: 'hal', value: 0 },
  { id: '8', name: 'Sedekah', nameId: 'Sedekah',category: 'CHARITY',icon: '💛', isDaily: false, isNumeric: true, unit: 'Rp', value: 0 },
  { id: '9', name: 'Dzikir Pagi', nameId: 'Dzikir Pagi', category: 'DZIKIR', icon: '📿', isDaily: true, isNumeric: false, value: false },
  { id: '10',name: 'Dzikir Sore', nameId: 'Dzikir Sore', category: 'DZIKIR', icon: '📿', isDaily: true, isNumeric: false, value: false },
  { id: '11',name: 'Tahajud', nameId: 'Tahajud', category: 'SHOLAT', icon: '⭐', isDaily: false, isNumeric: false, value: false },
];

export const useIbadahStore = create<IbadahState>()(
  persist(
    immer((set, get) => ({
      ibadahItems: DEFAULT_ITEMS,
      logs: {},
      todayStreak: 7,
      todayCompletion: 40,

      toggleIbadah: (id) => set((s) => {
        const item = s.ibadahItems.find(i => i.id === id);
        if (item && !item.isNumeric) {
          item.value = !item.value;
          item.completedAt = item.value ? new Date().toISOString() : undefined;
          // Recalculate completion
          const daily = s.ibadahItems.filter(i => i.isDaily);
          const done = daily.filter(i => i.isNumeric ? (i.value as number) > 0 : i.value === true);
          s.todayCompletion = Math.round((done.length / daily.length) * 100);
        }
      }),

      updateNumericIbadah: (id, value) => set((s) => {
        const item = s.ibadahItems.find(i => i.id === id);
        if (item && item.isNumeric) {
          item.value = value;
          item.completedAt = value > 0 ? new Date().toISOString() : undefined;
          const daily = s.ibadahItems.filter(i => i.isDaily);
          const done = daily.filter(i => i.isNumeric ? (i.value as number) > 0 : i.value === true);
          s.todayCompletion = Math.round((done.length / daily.length) * 100);
        }
      }),

      getTodayItems: () => get().ibadahItems.filter(i => i.isDaily),

      calculateStreak: () => set((s) => {
        // Simplified streak calculation
        s.todayStreak = 7; // would calculate from logs in real app
      }),
    })),
    {
      name: 'ibadah-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
