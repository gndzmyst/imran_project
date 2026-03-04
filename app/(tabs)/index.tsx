// app/(tabs)/index.tsx  — Home / Beranda
import React, { useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
  withDelay,
  FadeInDown,
  FadeIn,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { useTheme } from '@/components/ui/ThemeProvider';
import { PrayerCountdownCard } from '@/components/prayer/PrayerCountdownCard';
import { IbadahChecklist } from '@/components/ibadah/IbadahChecklist';
import { QuranProgressMini } from '@/components/quran/QuranProgressMini';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { MoonPhaseBackground } from '@/components/ui/MoonPhaseBackground';
import { RamadhanDayCounter } from '@/components/ui/RamadhanDayCounter';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useIbadahStore } from '@/stores/ibadahStore';
import { Typography, Spacing } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme, colors, isDark } = useTheme();
  const scrollY = useSharedValue(0);
  const { prayerTimes, nextPrayer, countdown } = usePrayerTimes();
  const { todayStreak, ibadahItems, todayCompletion } = useIbadahStore();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // ── Header parallax
  const headerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT],
        [0, -HEADER_HEIGHT * 0.4],
        Extrapolation.CLAMP
      ),
    }],
    opacity: interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  // ── Sticky mini header opacity
  const miniHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [HEADER_HEIGHT * 0.5, HEADER_HEIGHT * 0.8],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'Selamat Sahur';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const ramadhanDay = 15; // from store in real app

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── Sticky Mini Header (appears on scroll) */}
      <Animated.View
        style={[
          miniHeaderStyle,
          {
            position: 'absolute',
            top: 0, left: 0, right: 0, zIndex: 100,
            paddingTop: insets.top,
          },
        ]}
      >
        <BlurView
          intensity={isDark ? 80 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={{ paddingHorizontal: 20, paddingVertical: 12 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes['2xl'],
              color: colors.textPrimary,
            }}>
              Ramadhan Mode
            </Text>
            <StreakBadge count={todayStreak} size="sm" />
          </View>
        </BlurView>
      </Animated.View>

      {/* ── Main Scroll */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {}}
            tintColor={colors.accent}
          />
        }
      >
        {/* ══ HERO HEADER ══════════════════════════════ */}
        <Animated.View style={[headerStyle, { height: HEADER_HEIGHT }]}>
          {/* Moon & Stars Background */}
          <MoonPhaseBackground />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={
              isDark
                ? ['rgba(20,21,7,0)', 'rgba(20,21,7,0.7)', 'rgba(20,21,7,1)']
                : ['rgba(249,248,246,0)', 'rgba(249,248,246,0.6)', 'rgba(249,248,246,1)']
            }
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 }}
          />

          {/* Content */}
          <View
            style={{
              position: 'absolute',
              top: insets.top + 16,
              left: 0, right: 0,
              paddingHorizontal: Spacing[5],
            }}
          >
            {/* Top row: greeting + streak */}
            <MotiView
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 100 }}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <View>
                <Text style={{
                  fontFamily: Typography.fonts.bodyRegular,
                  fontSize: Typography.sizes.sm,
                  color: isDark ? colors.textSecondary : colors.textTertiary,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  {greeting()}
                </Text>
                <Text style={{
                  fontFamily: Typography.fonts.displayBold,
                  fontSize: Typography.sizes['4xl'],
                  color: colors.textPrimary,
                  lineHeight: Typography.lineHeights['4xl'],
                }}>
                  Ramadhan{'\n'}Mode
                </Text>
              </View>
              <StreakBadge count={todayStreak} size="lg" />
            </MotiView>

            {/* Ramadhan day pill */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 300 }}
              style={{ marginTop: Spacing[3] }}
            >
              <RamadhanDayCounter day={ramadhanDay} />
            </MotiView>
          </View>
        </Animated.View>

        {/* ══ PRAYER COUNTDOWN CARD ════════════════════ */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 120, delay: 200 }}
          style={{ marginHorizontal: Spacing[4], marginTop: -20 }}
        >
          <PrayerCountdownCard
            nextPrayer={nextPrayer}
            countdown={countdown}
            allPrayers={prayerTimes}
          />
        </MotiView>

        {/* ══ TODAY'S IBADAH ═══════════════════════════ */}
        <Animated.View
          entering={FadeInDown.delay(350).springify()}
          style={{ marginTop: Spacing[5] }}
        >
          {/* Section Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: Spacing[5],
            marginBottom: Spacing[3],
          }}>
            <View>
              <Text style={{
                fontFamily: Typography.fonts.displayBold,
                fontSize: Typography.sizes['2xl'],
                color: colors.textPrimary,
              }}>
                Ibadah Hari Ini
              </Text>
              <Text style={{
                fontFamily: Typography.fonts.bodyRegular,
                fontSize: Typography.sizes.sm,
                color: colors.textSecondary,
                marginTop: 2,
              }}>
                {todayCompletion}% selesai
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); router.push('/(tabs)/ibadah'); }}
              style={{
                paddingHorizontal: Spacing[3],
                paddingVertical: Spacing[2],
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{
                fontFamily: Typography.fonts.bodySemiBold,
                fontSize: Typography.sizes.xs,
                color: colors.accent,
              }}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ibadah Checklist (top 4) */}
          <IbadahChecklist
            items={ibadahItems.slice(0, 4)}
            horizontal
          />
        </Animated.View>

        {/* ══ QURAN PROGRESS ═══════════════════════════ */}
        <Animated.View
          entering={FadeInDown.delay(450).springify()}
          style={{
            marginHorizontal: Spacing[4],
            marginTop: Spacing[5],
          }}
        >
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); router.push('/(tabs)/quran'); }}
            activeOpacity={0.85}
          >
            <QuranProgressMini />
          </TouchableOpacity>
        </Animated.View>

        {/* ══ QUICK ACTIONS GRID ═══════════════════════ */}
        <Animated.View
          entering={FadeInDown.delay(550).springify()}
          style={{ marginTop: Spacing[5], paddingHorizontal: Spacing[4] }}
        >
          <Text style={{
            fontFamily: Typography.fonts.displayBold,
            fontSize: Typography.sizes['2xl'],
            color: colors.textPrimary,
            marginBottom: Spacing[3],
          }}>
            Akses Cepat
          </Text>
          <QuickActionsGrid />
        </Animated.View>

        {/* ══ MOTIVATIONAL QUOTE ═══════════════════════ */}
        <Animated.View
          entering={FadeInDown.delay(650).springify()}
          style={{
            marginHorizontal: Spacing[4],
            marginTop: Spacing[5],
          }}
        >
          <MotivationalQuote />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function QuickActionsGrid() {
  const { colors, isDark } = useTheme();

  const actions = [
    { icon: '🤲', label: 'Dua Iftar',    route: '/(tabs)/dua',     color: '#AEB784' },
    { icon: '📿', label: 'Dzikir Sore',  route: '/(tabs)/dua',     color: '#C9B59C' },
    { icon: '🧭', label: 'Kiblat',       route: '/(modals)/qiblah', color: '#D4AF37' },
    { icon: '📊', label: 'Laporan',      route: '/(tabs)/analytics',color: '#81C784' },
  ];

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {actions.map((action, i) => (
        <MotiView
          key={action.label}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 600 + i * 80 }}
          style={{ width: (SCREEN_W - 32 - 36) / 4 }}
        >
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(action.route as any);
            }}
            activeOpacity={0.8}
            style={{
              aspectRatio: 1,
              borderRadius: 20,
              backgroundColor: isDark ? colors.surface : colors.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 26 }}>{action.icon}</Text>
          </TouchableOpacity>
          <Text style={{
            fontFamily: Typography.fonts.bodyMedium,
            fontSize: 11,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 6,
          }}>
            {action.label}
          </Text>
        </MotiView>
      ))}
    </View>
  );
}

function MotivationalQuote() {
  const { colors, isDark } = useTheme();

  const quote = {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Sesungguhnya bersama kesulitan ada kemudahan.',
    source: 'QS. Al-Insyirah: 6',
  };

  return (
    <View
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <LinearGradient
        colors={
          isDark
            ? ['rgba(174,183,132,0.08)', 'rgba(174,183,132,0.03)']
            : ['rgba(201,181,156,0.12)', 'rgba(201,181,156,0.04)']
        }
        style={{ padding: Spacing[5] }}
      >
        {/* Arabic text - RTL */}
        <Text style={{
          fontFamily: Typography.fonts.arabicRegular,
          fontSize: Typography.sizes.arabicMd,
          color: isDark ? colors.accent : colors.borderStrong,
          textAlign: 'right',
          writingDirection: 'rtl',
          lineHeight: Typography.lineHeights.arabicMd,
          marginBottom: Spacing[3],
        }}>
          {quote.arabic}
        </Text>

        {/* Translation */}
        <Text style={{
          fontFamily: Typography.fonts.displaySemiBold,
          fontSize: Typography.sizes.lg,
          color: colors.textPrimary,
          fontStyle: 'italic',
          lineHeight: 26,
          marginBottom: Spacing[2],
        }}>
          "{quote.translation}"
        </Text>

        {/* Source */}
        <Text style={{
          fontFamily: Typography.fonts.bodyMedium,
          fontSize: Typography.sizes.sm,
          color: colors.textTertiary,
        }}>
          — {quote.source}
        </Text>
      </LinearGradient>
    </View>
  );
}
