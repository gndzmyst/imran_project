// components/prayer/PrayerCountdownCard.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Canvas, RoundedRect, LinearGradient as SkiaGradient, vec, Circle, Blur } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/components/ui/ThemeProvider';
import { Typography, Spacing, Radii, PrayerColors } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - Spacing[4] * 2;

type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

interface Prayer {
  name: PrayerName;
  nameId: string;
  time: string;
  isPassed: boolean;
  isNext: boolean;
}

interface Props {
  nextPrayer: { name: PrayerName; nameId: string; time: string } | null;
  countdown: string;
  allPrayers: Prayer[];
}

export function PrayerCountdownCard({ nextPrayer, countdown, allPrayers }: Props) {
  const { isDark, colors } = useTheme();
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    // Subtle pulse for countdown
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.sine) }),
        withTiming(1,    { duration: 1500, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      false,
    );
    glowAnim.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sine) }),
      -1,
      true,
    );
  }, []);

  const countdownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const prayerInfo = nextPrayer
    ? PrayerColors[nextPrayer.name]
    : PrayerColors.Isha;

  return (
    <View>
      {/* ── Main Card */}
      <View
        style={{
          borderRadius: Radii.card,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(174,183,132,0.2)' : 'rgba(201,181,156,0.3)',
        }}
      >
        {/* Skia glow background */}
        <Canvas style={{ position: 'absolute', top: 0, left: 0, width: CARD_W, height: 180 }}>
          <Circle cx={CARD_W * 0.75} cy={30} r={80} color={isDark ? 'rgba(174,183,132,0.06)' : 'rgba(201,181,156,0.10)'}>
            <Blur blur={30} />
          </Circle>
          <Circle cx={CARD_W * 0.2} cy={150} r={60} color={isDark ? 'rgba(212,175,55,0.04)' : 'rgba(212,175,55,0.06)'}>
            <Blur blur={25} />
          </Circle>
        </Canvas>

        {/* Gradient background */}
        <LinearGradient
          colors={
            isDark
              ? ['#1E2109', '#272B0D', '#1A1C0A']
              : ['#FFFFFF', '#F5F0EA', '#EFE9E3']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: Spacing[5] }}
        >
          {/* Top row: label + time */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{
                fontFamily: Typography.fonts.bodyMedium,
                fontSize: Typography.sizes.xs,
                color: isDark ? colors.textTertiary : colors.textTertiary,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                Sholat Berikutnya
              </Text>
              <Text style={{
                fontFamily: Typography.fonts.displayBold,
                fontSize: Typography.sizes['3xl'],
                color: isDark ? colors.accent : colors.textPrimary,
              }}>
                {nextPrayer?.nameId ?? '—'}
              </Text>
            </View>
            <MotiView
              animate={{ opacity: [0.6, 1] }}
              transition={{ type: 'timing', duration: 1500, loop: true }}
            >
              <Text style={{ fontSize: 36 }}>{prayerInfo.icon}</Text>
            </MotiView>
          </View>

          {/* Countdown */}
          <Animated.View style={[countdownStyle, { marginTop: Spacing[3] }]}>
            <Text style={{
              fontFamily: Typography.fonts.monoBold,
              fontSize: Typography.sizes['5xl'],
              color: isDark ? colors.textPrimary : colors.textPrimary,
              letterSpacing: 4,
            }}>
              {countdown}
            </Text>
          </Animated.View>

          {/* Prayer time */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing[1] }}>
            <Text style={{ fontSize: 12, marginRight: 6 }}>🕐</Text>
            <Text style={{
              fontFamily: Typography.fonts.bodyRegular,
              fontSize: Typography.sizes.sm,
              color: isDark ? colors.textSecondary : colors.textSecondary,
            }}>
              {nextPrayer?.time ?? '--:--'} WIB
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* ── Prayer Timeline Scroll */}
      <PrayerTimeline prayers={allPrayers} />
    </View>
  );
}

function PrayerTimeline({ prayers }: { prayers: Prayer[] }) {
  const { isDark, colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: Spacing[3],
        gap: 8,
      }}
    >
      {prayers.map((prayer, i) => {
        const prayerColor = PrayerColors[prayer.name];
        return (
          <MotiView
            key={prayer.name}
            from={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: i * 60 }}
            style={{ flex: 1 }}
          >
            <View
              style={{
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                backgroundColor: prayer.isNext
                  ? isDark ? 'rgba(174,183,132,0.18)' : 'rgba(201,181,156,0.25)'
                  : prayer.isPassed
                    ? isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
                    : isDark ? colors.surface : colors.surfaceElevated,
                borderWidth: prayer.isNext ? 1 : 0.5,
                borderColor: prayer.isNext
                  ? isDark ? colors.accent : colors.accent
                  : colors.border,
                opacity: prayer.isPassed ? 0.5 : 1,
              }}
            >
              <Text style={{ fontSize: 14, marginBottom: 3 }}>
                {prayerColor.icon}
              </Text>
              <Text style={{
                fontFamily: Typography.fonts.bodySemiBold,
                fontSize: 10,
                color: prayer.isNext
                  ? isDark ? colors.accent : colors.textPrimary
                  : colors.textSecondary,
              }}>
                {prayer.nameId}
              </Text>
              <Text style={{
                fontFamily: Typography.fonts.monoRegular,
                fontSize: 9,
                color: colors.textTertiary,
                marginTop: 2,
              }}>
                {prayer.time}
              </Text>
            </View>
          </MotiView>
        );
      })}
    </View>
  );
}
