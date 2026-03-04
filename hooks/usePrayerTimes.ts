// hooks/usePrayerTimes.ts
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Madhab, HighLatitudeRule } from 'adhan';
import { format, differenceInSeconds } from 'date-fns';

type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

interface PrayerTime {
  name: PrayerName;
  nameId: string;
  time: string;
  date: Date;
  isPassed: boolean;
  isNext: boolean;
}

const PRAYER_NAMES_ID: Record<string, string> = {
  Fajr:    'Subuh',
  Sunrise: 'Syuruq',
  Dhuhr:   'Dzuhur',
  Asr:     'Ashar',
  Maghrib: 'Maghrib',
  Isha:    'Isya',
};

function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function usePrayerTimes() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState('--:--:--');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Get location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // Default to Jakarta if no permission
          setLocation({ lat: -6.2088, lng: 106.8456 });
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      } catch {
        setLocation({ lat: -6.2088, lng: 106.8456 });
      }
    })();
  }, []);

  // ── Calculate prayer times
  useEffect(() => {
    if (!location) return;

    const calculateTimes = () => {
      const now = new Date();
      const coords = new Coordinates(location.lat, location.lng);

      // Use Kemenag RI (similar to Muslim World League for Indonesia)
      const params = CalculationMethod.MuslimWorldLeague();
      params.madhab = Madhab.Shafi;

      const times = new PrayerTimes(coords, now, params);

      const prayers: Array<{ name: PrayerName; date: Date }> = [
        { name: 'Fajr',    date: times.fajr },
        { name: 'Sunrise', date: times.sunrise },
        { name: 'Dhuhr',   date: times.dhuhr },
        { name: 'Asr',     date: times.asr },
        { name: 'Maghrib', date: times.maghrib },
        { name: 'Isha',    date: times.isha },
      ];

      // Find next prayer
      const nextIdx = prayers.findIndex(p => p.date > now);

      const mapped: PrayerTime[] = prayers.map((p, i) => ({
        name:     p.name,
        nameId:   PRAYER_NAMES_ID[p.name],
        time:     formatTime(p.date),
        date:     p.date,
        isPassed: p.date <= now,
        isNext:   i === nextIdx,
      }));

      setPrayerTimes(mapped);
      setNextPrayer(nextIdx >= 0 ? mapped[nextIdx] : null);
      setLoading(false);
    };

    calculateTimes();
  }, [location]);

  // ── Countdown timer
  useEffect(() => {
    if (!nextPrayer) return;

    const tick = () => {
      const now = new Date();
      const diff = differenceInSeconds(nextPrayer.date, now);
      if (diff <= 0) {
        setCountdown('00:00:00');
        // Recalculate prayer times
        setLocation(prev => prev ? { ...prev } : null);
      } else {
        setCountdown(formatCountdown(diff));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  return { prayerTimes, nextPrayer, countdown, loading, error, location };
}
