// app/(tabs)/quran.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, RoundedRect, LinearGradient as SkiaLinearGradient, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/components/ui/ThemeProvider';
import { Typography, Spacing, Radii } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

// 30 juz data
const JUZ_DATA = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  name: `Juz ${i + 1}`,
  pages: 20,
  completed: i < 7 ? 20 : i === 7 ? 12 : 0,
}));

export default function QuranScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(152);
  const [todayPages, setTodayPages] = useState('');
  const [targetTotal] = useState(604);
  const [showInput, setShowInput] = useState(false);

  const progress = Math.min((currentPage / targetTotal) * 100, 100);
  const pagesPerDay = Math.ceil((targetTotal - currentPage) / 14); // days remaining
  const juzCompleted = Math.floor(currentPage / 20);
  const currentJuz = Math.min(juzCompleted + 1, 30);

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
          paddingBottom: Spacing[2],
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
              Target Khatam
            </Text>
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes['4xl'],
              color: colors.textPrimary,
            }}>
              Al-Qur'an
            </Text>
          </MotiView>
        </View>

        {/* ── Hero Progress Card */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{ marginHorizontal: Spacing[4], marginTop: Spacing[2] }}
        >
          <View
            style={{
              borderRadius: Radii.card,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(100,181,246,0.2)' : 'rgba(21,101,192,0.15)',
            }}
          >
            {/* Skia gradient background */}
            <Canvas style={{ position: 'absolute', width: SCREEN_W - Spacing[4] * 2, height: 220 }}>
              <RoundedRect x={0} y={0} width={SCREEN_W - Spacing[4] * 2} height={220} r={20}>
                <SkiaLinearGradient
                  start={vec(0, 0)}
                  end={vec(SCREEN_W, 220)}
                  colors={
                    isDark
                      ? ['#0B2D72', '#0992C2', '#0D1117']
                      : ['#E3F2FD', '#BBDEFB', '#EDE7F6']
                  }
                />
              </RoundedRect>
            </Canvas>

            <View style={{ padding: Spacing[5] }}>
              {/* Arabic Bismillah */}
              <Text style={{
                fontFamily: Typography.fonts.arabicRegular,
                fontSize: Typography.sizes.arabicMd,
                color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(21,101,192,0.2)',
                textAlign: 'right',
                writingDirection: 'rtl',
                position: 'absolute',
                right: Spacing[4],
                top: Spacing[3],
              }}>
                بِسْمِ اللَّهِ
              </Text>

              {/* Pages counter */}
              <View style={{ marginTop: Spacing[6] }}>
                <Text style={{
                  fontFamily: Typography.fonts.monoRegular,
                  fontSize: Typography.sizes.sm,
                  color: isDark ? 'rgba(100,181,246,0.8)' : 'rgba(21,101,192,0.7)',
                  letterSpacing: 1,
                }}>
                  HALAMAN
                </Text>
                <MotiView
                  from={{ translateX: -20, opacity: 0 }}
                  animate={{ translateX: 0, opacity: 1 }}
                  transition={{ type: 'spring', delay: 200 }}
                  style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}
                >
                  <Text style={{
                    fontFamily: Typography.fonts.monoBold,
                    fontSize: Typography.sizes['6xl'],
                    color: isDark ? '#FFFFFF' : '#0B2D72',
                    letterSpacing: -2,
                  }}>
                    {currentPage}
                  </Text>
                  <Text style={{
                    fontFamily: Typography.fonts.bodyRegular,
                    fontSize: Typography.sizes.xl,
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(11,45,114,0.5)',
                  }}>
                    / {targetTotal}
                  </Text>
                </MotiView>
              </View>

              {/* Progress Bar */}
              <View style={{
                height: 8,
                borderRadius: 999,
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(11,45,114,0.12)',
                marginTop: Spacing[3],
                overflow: 'hidden',
              }}>
                <MotiView
                  from={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'timing', duration: 1000, delay: 300 }}
                  style={{
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: isDark ? '#0AC4E0' : '#0B2D72',
                  }}
                />
              </View>

              {/* Stats row */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Spacing[3],
              }}>
                {[
                  { label: 'Progress', value: `${progress.toFixed(1)}%` },
                  { label: 'Juz', value: `${juzCompleted}/30` },
                  { label: 'Target/hari', value: `${pagesPerDay} hal` },
                ].map((stat, i) => (
                  <View key={i} style={{ alignItems: 'center' }}>
                    <Text style={{
                      fontFamily: Typography.fonts.monoBold,
                      fontSize: Typography.sizes.lg,
                      color: isDark ? '#FFFFFF' : '#0B2D72',
                    }}>
                      {stat.value}
                    </Text>
                    <Text style={{
                      fontFamily: Typography.fonts.bodyRegular,
                      fontSize: Typography.sizes.xs,
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(11,45,114,0.6)',
                      marginTop: 2,
                    }}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Log Today's Reading */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={{ marginHorizontal: Spacing[4], marginTop: Spacing[4] }}
        >
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setShowInput(!showInput);
            }}
            activeOpacity={0.85}
          >
            <View
              style={{
                borderRadius: Radii.xl,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : colors.surfaceElevated,
                padding: Spacing[4],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
                <Text style={{ fontSize: 24 }}>📖</Text>
                <View>
                  <Text style={{
                    fontFamily: Typography.fonts.bodySemiBold,
                    fontSize: Typography.sizes.md,
                    color: colors.textPrimary,
                  }}>
                    Catat Tilawah Hari Ini
                  </Text>
                  <Text style={{
                    fontFamily: Typography.fonts.bodyRegular,
                    fontSize: Typography.sizes.sm,
                    color: colors.textSecondary,
                  }}>
                    Target hari ini: {pagesPerDay} halaman
                  </Text>
                </View>
              </View>
              <Text style={{
                fontSize: 20,
                transform: [{ rotate: showInput ? '90deg' : '0deg' }],
              }}>
                ›
              </Text>
            </View>
          </TouchableOpacity>

          {/* Input expandable */}
          <AnimatePresence>
            {showInput && (
              <MotiView
                from={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'timing', duration: 250 }}
                style={{
                  marginTop: 8,
                  borderRadius: Radii.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: isDark ? colors.surfaceElevated : colors.surface,
                  padding: Spacing[4],
                }}
              >
                <Text style={{
                  fontFamily: Typography.fonts.bodyMedium,
                  fontSize: Typography.sizes.sm,
                  color: colors.textSecondary,
                  marginBottom: Spacing[3],
                }}>
                  Sampai halaman berapa hari ini?
                </Text>
                <View style={{ flexDirection: 'row', gap: Spacing[3] }}>
                  <TextInput
                    value={todayPages}
                    onChangeText={setTodayPages}
                    keyboardType="numeric"
                    placeholder={String(currentPage)}
                    placeholderTextColor={colors.textPlaceholder}
                    style={{
                      flex: 1,
                      fontFamily: Typography.fonts.monoBold,
                      fontSize: Typography.sizes['2xl'],
                      color: colors.textPrimary,
                      borderBottomWidth: 2,
                      borderColor: isDark ? colors.accent : colors.textPrimary,
                      paddingBottom: 4,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const page = parseInt(todayPages);
                      if (page > 0 && page <= targetTotal) {
                        setCurrentPage(page);
                        setTodayPages('');
                        setShowInput(false);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      }
                    }}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: Radii.lg,
                      backgroundColor: isDark ? colors.accent : colors.textPrimary,
                    }}
                  >
                    <Text style={{
                      fontFamily: Typography.fonts.bodySemiBold,
                      fontSize: Typography.sizes.md,
                      color: isDark ? colors.textInverse : colors.textInverse,
                    }}>
                      Simpan
                    </Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </Animated.View>

        {/* ── 30 Juz Grid */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={{ marginTop: Spacing[5], paddingHorizontal: Spacing[4] }}
        >
          <Text style={{
            fontFamily: Typography.fonts.displayBold,
            fontSize: Typography.sizes['2xl'],
            color: colors.textPrimary,
            marginBottom: Spacing[3],
          }}>
            30 Juz Progress
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {JUZ_DATA.map((juz, i) => {
              const juzProgress = juz.completed / juz.pages;
              const isComplete = juz.completed >= juz.pages;
              const isCurrent = juz.number === currentJuz;

              return (
                <MotiView
                  key={juz.number}
                  from={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: i * 30 }}
                  style={{
                    width: (SCREEN_W - Spacing[4] * 2 - 8 * 5) / 6,
                  }}
                >
                  <View
                    style={{
                      aspectRatio: 1,
                      borderRadius: 10,
                      backgroundColor: isComplete
                        ? isDark ? 'rgba(10,196,224,0.20)' : 'rgba(11,45,114,0.15)'
                        : isCurrent
                          ? isDark ? 'rgba(174,183,132,0.15)' : 'rgba(201,181,156,0.20)'
                          : isDark ? colors.surface : colors.surfaceElevated,
                      borderWidth: 1,
                      borderColor: isComplete
                        ? isDark ? 'rgba(10,196,224,0.40)' : 'rgba(11,45,114,0.30)'
                        : isCurrent
                          ? isDark ? colors.accent : colors.accent
                          : colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isComplete ? (
                      <Text style={{ fontSize: 14 }}>✓</Text>
                    ) : (
                      <Text style={{
                        fontFamily: Typography.fonts.monoBold,
                        fontSize: 11,
                        color: isCurrent
                          ? isDark ? colors.accent : colors.textPrimary
                          : colors.textTertiary,
                      }}>
                        {juz.number}
                      </Text>
                    )}
                  </View>
                </MotiView>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
