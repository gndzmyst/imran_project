// app/(tabs)/analytics.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Rect, LinearGradient as SkiaGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { useTheme } from '@/components/ui/ThemeProvider';
import { Typography, Spacing, Radii } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

// Mock weekly data
const WEEKLY_DATA = [
  { day: 'Sen', sholat: 5, tilawah: 8, dzikir: 2 },
  { day: 'Sel', sholat: 4, tilawah: 10, dzikir: 2 },
  { day: 'Rab', sholat: 5, tilawah: 12, dzikir: 2 },
  { day: 'Kam', sholat: 5, tilawah: 6, dzikir: 1 },
  { day: 'Jum', sholat: 5, tilawah: 14, dzikir: 2 },
  { day: 'Sab', sholat: 4, tilawah: 8, dzikir: 2 },
  { day: 'Min', sholat: 5, tilawah: 11, dzikir: 2 },
];

const STATS = [
  { icon: '🕌', label: 'Total Sholat', value: '147', unit: 'waktu', color: '#AEB784' },
  { icon: '📖', label: 'Total Tilawah', value: '152', unit: 'halaman', color: '#0AC4E0' },
  { icon: '💛', label: 'Total Sedekah', value: '250K', unit: 'Rp', color: '#D4AF37' },
  { icon: '🔥', label: 'Streak Terpanjang', value: '12', unit: 'hari', color: '#FF7043' },
];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [activeMetric, setActiveMetric] = useState<'sholat' | 'tilawah' | 'dzikir'>('sholat');

  const maxValue = Math.max(...WEEKLY_DATA.map(d => d[activeMetric]));

  const metricColors: Record<string, string> = {
    sholat:  isDark ? '#AEB784' : '#2E7D32',
    tilawah: isDark ? '#0AC4E0' : '#0B2D72',
    dzikir:  isDark ? '#CE93D8' : '#6A1B9A',
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* ── Header */}
        <View style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: Spacing[5],
          paddingBottom: Spacing[3],
        }}>
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
          >
            <Text style={{
              fontFamily: Typography.fonts.bodyMedium,
              fontSize: Typography.sizes.xs,
              color: colors.textTertiary,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
              Analitik
            </Text>
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes['4xl'],
              color: colors.textPrimary,
            }}>
              Progres{'\n'}Ramadhan
            </Text>
          </MotiView>
        </View>

        {/* ── Stats Grid */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            paddingHorizontal: Spacing[4],
          }}
        >
          {STATS.map((stat, i) => (
            <MotiView
              key={stat.label}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: i * 80 }}
              style={{ width: (SCREEN_W - Spacing[4] * 2 - 12) / 2 }}
            >
              <View
                style={{
                  borderRadius: Radii.xl,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: isDark ? colors.surface : colors.surfaceElevated,
                  padding: Spacing[4],
                }}
              >
                <Text style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</Text>
                <Text style={{
                  fontFamily: Typography.fonts.monoBold,
                  fontSize: Typography.sizes['3xl'],
                  color: stat.color,
                }}>
                  {stat.value}
                </Text>
                <Text style={{
                  fontFamily: Typography.fonts.bodyRegular,
                  fontSize: Typography.sizes.xs,
                  color: colors.textTertiary,
                }}>
                  {stat.unit}
                </Text>
                <Text style={{
                  fontFamily: Typography.fonts.bodyMedium,
                  fontSize: Typography.sizes.sm,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}>
                  {stat.label}
                </Text>
              </View>
            </MotiView>
          ))}
        </Animated.View>

        {/* ── Weekly Chart */}
        <Animated.View
          entering={FadeInDown.delay(250).springify()}
          style={{
            marginHorizontal: Spacing[4],
            marginTop: Spacing[5],
            borderRadius: Radii.card,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: isDark ? colors.surface : colors.surfaceElevated,
            padding: Spacing[4],
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[4] }}>
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes.xl,
              color: colors.textPrimary,
            }}>
              Minggu Ini
            </Text>
            {/* Metric toggle */}
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {(['sholat', 'tilawah', 'dzikir'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => { Haptics.selectionAsync(); setActiveMetric(m); }}
                >
                  <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: activeMetric === m
                      ? metricColors[m] + '25'
                      : 'transparent',
                    borderWidth: 1,
                    borderColor: activeMetric === m ? metricColors[m] : colors.border,
                  }}>
                    <Text style={{
                      fontFamily: Typography.fonts.bodySemiBold,
                      fontSize: 11,
                      color: activeMetric === m ? metricColors[m] : colors.textTertiary,
                    }}>
                      {m === 'sholat' ? '🕌' : m === 'tilawah' ? '📖' : '📿'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bar Chart */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8 }}>
            {WEEKLY_DATA.map((data, i) => {
              const val = data[activeMetric];
              const heightPct = maxValue > 0 ? (val / maxValue) : 0;
              const barH = Math.max(heightPct * 100, 4);
              const isToday = i === new Date().getDay() - 1;

              return (
                <View key={data.day} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  {/* Bar */}
                  <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%' }}>
                    <MotiView
                      from={{ height: 0 }}
                      animate={{ height: barH }}
                      transition={{ type: 'spring', delay: i * 60 }}
                      style={{
                        width: '100%',
                        borderRadius: 6,
                        backgroundColor: isToday
                          ? metricColors[activeMetric]
                          : metricColors[activeMetric] + '50',
                      }}
                    />
                  </View>
                  {/* Value */}
                  <Text style={{
                    fontFamily: Typography.fonts.monoRegular,
                    fontSize: 10,
                    color: colors.textTertiary,
                  }}>
                    {val}
                  </Text>
                  {/* Day label */}
                  <Text style={{
                    fontFamily: isToday ? Typography.fonts.bodySemiBold : Typography.fonts.bodyRegular,
                    fontSize: 11,
                    color: isToday ? colors.textPrimary : colors.textTertiary,
                  }}>
                    {data.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Achievement Badges */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={{ marginTop: Spacing[5], paddingHorizontal: Spacing[4] }}
        >
          <Text style={{
            fontFamily: Typography.fonts.displayBold,
            fontSize: Typography.sizes['2xl'],
            color: colors.textPrimary,
            marginBottom: Spacing[3],
          }}>
            Pencapaian
          </Text>
          <BadgeGrid />
        </Animated.View>

        {/* ── Generate Ramadhan Report CTA */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={{ marginHorizontal: Spacing[4], marginTop: Spacing[5] }}
        >
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(modals)/report');
            }}
            activeOpacity={0.9}
          >
            <View style={{ borderRadius: Radii.card, overflow: 'hidden' }}>
              <Canvas style={{ position: 'absolute', width: SCREEN_W - Spacing[4] * 2, height: 100 }}>
                <RoundedRect x={0} y={0} width={SCREEN_W - Spacing[4] * 2} height={100} r={20}>
                  <SkiaGradient
                    start={vec(0, 0)}
                    end={vec(SCREEN_W, 100)}
                    colors={isDark
                      ? ['#1A5C00', '#2E7D32', '#1A1C0A']
                      : ['#E8F5E9', '#C8E6C9', '#F9F8F6']}
                  />
                </RoundedRect>
              </Canvas>
              <View style={{
                padding: Spacing[5],
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing[4],
              }}>
                <Text style={{ fontSize: 36 }}>📋</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: Typography.fonts.displayBold,
                    fontSize: Typography.sizes.xl,
                    color: isDark ? '#A5D6A7' : '#1B5E20',
                  }}>
                    Buat Laporan Ramadhan
                  </Text>
                  <Text style={{
                    fontFamily: Typography.fonts.bodyRegular,
                    fontSize: Typography.sizes.sm,
                    color: isDark ? '#81C784' : '#2E7D32',
                    marginTop: 2,
                  }}>
                    Rekap perjalanan ibadahmu & bagikan
                  </Text>
                </View>
                <Text style={{ fontSize: 20, color: isDark ? '#A5D6A7' : '#2E7D32' }}>›</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Badge Grid ───────────────────────────────────────────────────
const BADGES = [
  { id: '1', icon: '⭐', name: 'Pejuang Subuh', desc: '7 hari subuh tepat waktu', earned: true },
  { id: '2', icon: '📖', name: 'Khatam Perdana', desc: 'Khatam Al-Qur\'an 1x', earned: false },
  { id: '3', icon: '💛', name: 'Dermawan', desc: 'Sedekah 10 hari berturut', earned: true },
  { id: '4', icon: '🔥', name: 'Streak Master', desc: '30 hari konsisten', earned: false },
  { id: '5', icon: '🕌', name: 'Mujahid Tarawih', desc: 'Tarawih 14 malam', earned: true },
  { id: '6', icon: '🌙', name: 'Pemburu Qadr', desc: '10 malam terakhir qiyam', earned: false },
];

function BadgeGrid() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {BADGES.map((badge, i) => (
        <MotiView
          key={badge.id}
          from={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: badge.earned ? 1 : 0.4, scale: 1 }}
          transition={{ type: 'spring', delay: i * 60 }}
          style={{ width: (SCREEN_W - Spacing[4] * 2 - 10 * 2) / 3 }}
        >
          <View style={{
            borderRadius: Radii.xl,
            borderWidth: 1,
            borderColor: badge.earned
              ? isDark ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.5)'
              : colors.border,
            backgroundColor: badge.earned
              ? isDark ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.06)'
              : isDark ? colors.surface : colors.surfaceElevated,
            padding: Spacing[3],
            alignItems: 'center',
            gap: 6,
          }}>
            <Text style={{ fontSize: 28 }}>{badge.icon}</Text>
            <Text style={{
              fontFamily: Typography.fonts.bodySemiBold,
              fontSize: 11,
              color: badge.earned ? colors.textPrimary : colors.textTertiary,
              textAlign: 'center',
            }}>
              {badge.name}
            </Text>
            <Text style={{
              fontFamily: Typography.fonts.bodyRegular,
              fontSize: 10,
              color: colors.textTertiary,
              textAlign: 'center',
              lineHeight: 14,
            }}>
              {badge.desc}
            </Text>
          </View>
        </MotiView>
      ))}
    </View>
  );
}
