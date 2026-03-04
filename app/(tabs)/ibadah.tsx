// app/(tabs)/ibadah.tsx
import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  ZoomIn,
  Layout,
} from 'react-native-reanimated';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/components/ui/ThemeProvider';
import { useIbadahStore, IbadahItem } from '@/stores/ibadahStore';
import { Typography, Spacing, Radii, IbadahColors } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

export default function IbadahScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { ibadahItems, todayCompletion, todayStreak, toggleIbadah, updateNumericIbadah } = useIbadahStore();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = ['ALL', 'SHOLAT', 'QURAN', 'CHARITY', 'DZIKIR', 'OTHER'];
  const categoryLabels: Record<string, string> = {
    ALL: 'Semua', SHOLAT: '🕌 Sholat', QURAN: '📖 Qur\'an',
    CHARITY: '💛 Sedekah', DZIKIR: '📿 Dzikir', OTHER: '✨ Lainnya',
  };

  const filteredItems = activeFilter === 'ALL'
    ? ibadahItems
    : ibadahItems.filter(i => i.category === activeFilter);

  const completedCount = ibadahItems.filter(i =>
    i.isNumeric ? (i.value as number) > 0 : i.value === true
  ).length;

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
          paddingBottom: Spacing[4],
        }}>
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Text style={{
              fontFamily: Typography.fonts.bodyMedium,
              fontSize: Typography.sizes.xs,
              color: colors.textTertiary,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
              Pelacak Ibadah
            </Text>
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes['4xl'],
              color: colors.textPrimary,
              lineHeight: 44,
            }}>
              Ibadah{'\n'}Harian
            </Text>
          </MotiView>

          {/* Completion Ring & Stats */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 150 }}
            style={{ marginTop: Spacing[4] }}
          >
            <CompletionSummaryCard
              completion={todayCompletion}
              completedCount={completedCount}
              total={ibadahItems.length}
              streak={todayStreak}
            />
          </MotiView>
        </View>

        {/* ── Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing[5], gap: 8 }}
          style={{ marginBottom: Spacing[4] }}
        >
          {categories.map((cat, i) => (
            <MotiView
              key={cat}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: i * 50 }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveFilter(cat);
                }}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: activeFilter === cat
                      ? isDark ? colors.accent : colors.textPrimary
                      : isDark ? colors.surface : colors.surfaceElevated,
                    borderWidth: 1,
                    borderColor: activeFilter === cat
                      ? 'transparent'
                      : colors.border,
                  }}
                >
                  <Text style={{
                    fontFamily: Typography.fonts.bodySemiBold,
                    fontSize: Typography.sizes.sm,
                    color: activeFilter === cat
                      ? isDark ? colors.textInverse : colors.textInverse
                      : colors.textSecondary,
                  }}>
                    {categoryLabels[cat]}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </ScrollView>

        {/* ── Ibadah Items */}
        <View style={{ paddingHorizontal: Spacing[4], gap: 12 }}>
          {filteredItems.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(i * 60).springify()}
              layout={Layout.springify()}
            >
              <IbadahCard
                item={item}
                onToggle={() => {
                  if (!item.isNumeric) {
                    Haptics.impactAsync(
                      item.value
                        ? Haptics.ImpactFeedbackStyle.Light
                        : Haptics.ImpactFeedbackStyle.Medium
                    );
                    toggleIbadah(item.id);
                  }
                }}
                onUpdateValue={(val) => updateNumericIbadah(item.id, val)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Completion Summary Card ──────────────────────────────────────
function CompletionSummaryCard({
  completion, completedCount, total, streak
}: { completion: number; completedCount: number; total: number; streak: number }) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        borderRadius: Radii.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <LinearGradient
        colors={
          isDark
            ? ['#1E2109', '#272B0D']
            : ['#FFFFFF', '#F5F0EA']
        }
        style={{
          padding: Spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing[4],
        }}
      >
        {/* Circular progress */}
        <CircularProgress percent={completion} size={80} />

        {/* Stats */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: Typography.fonts.displayBold,
            fontSize: Typography.sizes['2xl'],
            color: colors.textPrimary,
          }}>
            {completedCount}/{total} Selesai
          </Text>
          <Text style={{
            fontFamily: Typography.fonts.bodyRegular,
            fontSize: Typography.sizes.sm,
            color: colors.textSecondary,
            marginTop: 2,
          }}>
            Hari ini kamu sudah{' '}
            <Text style={{
              fontFamily: Typography.fonts.bodySemiBold,
              color: isDark ? colors.accent : colors.textPrimary,
            }}>
              {completion}%
            </Text>{' '}
            ibadah ✨
          </Text>

          {/* Streak */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <Text style={{
              fontFamily: Typography.fonts.monoRegular,
              fontSize: Typography.sizes.sm,
              color: colors.textPrimary,
            }}>
              <Text style={{ fontFamily: Typography.fonts.monoBold }}>{streak}</Text> hari streak
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

// ── Circular Progress ────────────────────────────────────────────
function CircularProgress({ percent, size }: { percent: number; size: number }) {
  const { colors, isDark } = useTheme();
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* SVG-like using border trick */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 5,
          borderColor: isDark ? colors.surface : colors.surfaceMuted,
          position: 'absolute',
        }}
      />
      <Text style={{
        fontFamily: Typography.fonts.monoBold,
        fontSize: Typography.sizes.lg,
        color: isDark ? colors.accent : colors.textPrimary,
      }}>
        {percent}%
      </Text>
    </View>
  );
}

// ── Single Ibadah Card ───────────────────────────────────────────
function IbadahCard({
  item,
  onToggle,
  onUpdateValue,
}: {
  item: IbadahItem;
  onToggle: () => void;
  onUpdateValue: (val: number) => void;
}) {
  const { colors, isDark } = useTheme();
  const [showNumericInput, setShowNumericInput] = useState(false);
  const [inputValue, setInputValue] = useState(String(item.value));

  const catColors = IbadahColors[item.category];
  const isCompleted = item.isNumeric ? (item.value as number) > 0 : item.value === true;

  const checkAnim = useSharedValue(isCompleted ? 1 : 0);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(checkAnim.value, [0, 1], [0.8, 1]) }],
    opacity: checkAnim.value,
  }));

  const handleToggle = () => {
    if (item.isNumeric) {
      setShowNumericInput(true);
    } else {
      checkAnim.value = isCompleted
        ? withTiming(0, { duration: 150 })
        : withSequence(withSpring(1.3), withSpring(1));
      onToggle();
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.85}
      >
        <MotiView
          animate={{
            backgroundColor: isCompleted
              ? isDark
                ? `rgba(174,183,132,0.10)`
                : `rgba(201,181,156,0.15)`
              : isDark ? '#1E2109' : '#FFFFFF',
            borderColor: isCompleted
              ? isDark ? 'rgba(174,183,132,0.35)' : 'rgba(201,181,156,0.50)'
              : isDark ? '#3A4018' : '#D9CFC7',
          }}
          transition={{ type: 'timing', duration: 250 }}
          style={{
            borderRadius: Radii.xl,
            borderWidth: 1,
            padding: Spacing[4],
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing[3],
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.05)'
                : catColors.bg + '80',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 22 }}>{item.icon}</Text>
          </View>

          {/* Label */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: isCompleted
                ? Typography.fonts.bodySemiBold
                : Typography.fonts.bodyMedium,
              fontSize: Typography.sizes.md,
              color: isCompleted ? colors.textPrimary : colors.textSecondary,
              textDecorationLine: isCompleted && !item.isNumeric ? 'line-through' : 'none',
              opacity: isCompleted && !item.isNumeric ? 0.6 : 1,
            }}>
              {item.nameId}
            </Text>
            {item.isNumeric && (
              <Text style={{
                fontFamily: Typography.fonts.bodyRegular,
                fontSize: Typography.sizes.sm,
                color: colors.textTertiary,
                marginTop: 2,
              }}>
                {item.value as number > 0
                  ? `${item.value} ${item.unit} dicatat`
                  : `Ketuk untuk catat ${item.unit}`}
              </Text>
            )}
          </View>

          {/* Check / Value indicator */}
          {item.isNumeric ? (
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: (item.value as number) > 0
                  ? isDark ? colors.accent : colors.textPrimary
                  : 'transparent',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{
                fontFamily: Typography.fonts.monoRegular,
                fontSize: Typography.sizes.sm,
                color: (item.value as number) > 0
                  ? isDark ? colors.textInverse : colors.textInverse
                  : colors.textTertiary,
              }}>
                {item.value as number > 0 ? `${item.value}` : '—'}
              </Text>
            </View>
          ) : (
            <MotiView
              animate={{
                backgroundColor: isCompleted
                  ? isDark ? colors.accent : colors.textPrimary
                  : 'transparent',
                borderColor: isCompleted
                  ? isDark ? colors.accent : colors.textPrimary
                  : colors.border,
              }}
              transition={{ type: 'timing', duration: 200 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isCompleted && (
                <Animated.Text
                  entering={ZoomIn.duration(200)}
                  style={{ fontSize: 14 }}
                >
                  ✓
                </Animated.Text>
              )}
            </MotiView>
          )}
        </MotiView>
      </TouchableOpacity>

      {/* Numeric Input Modal */}
      <Modal
        visible={showNumericInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNumericInput(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => setShowNumericInput(false)}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.surfaceElevated : colors.surfaceElevated,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: Spacing[5],
              paddingBottom: Spacing[10],
            }}
          >
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes['2xl'],
              color: colors.textPrimary,
              marginBottom: Spacing[4],
            }}>
              Catat {item.nameId}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing[3],
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: Radii.lg,
              padding: Spacing[3],
            }}>
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  fontFamily: Typography.fonts.monoBold,
                  fontSize: Typography.sizes['4xl'],
                  color: colors.textPrimary,
                  textAlign: 'center',
                }}
                placeholder="0"
                placeholderTextColor={colors.textPlaceholder}
                autoFocus
              />
              <Text style={{
                fontFamily: Typography.fonts.bodyRegular,
                fontSize: Typography.sizes.lg,
                color: colors.textSecondary,
              }}>
                {item.unit}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                const val = parseFloat(inputValue) || 0;
                onUpdateValue(val);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setShowNumericInput(false);
              }}
              style={{
                marginTop: Spacing[4],
                paddingVertical: Spacing[4],
                borderRadius: Radii.lg,
                backgroundColor: isDark ? colors.accent : colors.textPrimary,
                alignItems: 'center',
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
        </TouchableOpacity>
      </Modal>
    </>
  );
}
