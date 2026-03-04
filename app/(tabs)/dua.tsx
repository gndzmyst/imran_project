// app/(tabs)/dua.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { useTheme } from '@/components/ui/ThemeProvider';
import { Typography, Spacing, Radii } from '@/constants/theme';

const DUAS = [
  {
    id: '1', category: 'SAHUR',
    title: 'Niat Puasa Ramadhan',
    arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
    transliteration: 'Nawaitu shauma ghadin \'an adā\'i fardhi syahri Ramadhāna hādzihis sanati lillāhi ta\'ālā.',
    translation: 'Aku berniat puasa esok hari untuk menunaikan fardhu bulan Ramadhan tahun ini karena Allah Ta\'ala.',
    isBookmarked: false,
  },
  {
    id: '2', category: 'IFTAR',
    title: 'Doa Buka Puasa',
    arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    transliteration: 'Allāhumma laka shumtu wa bika āmantu wa \'alaika tawakkaltu wa \'alā rizqika afthartu.',
    translation: 'Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, kepada-Mu aku bertawakal, dan dengan rezeki-Mu aku berbuka.',
    isBookmarked: true,
  },
  {
    id: '3', category: 'PAGI',
    title: 'Dzikir Pagi — Ayat Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Allāhu lā ilāha illā huw, al-Ḥayyul-Qayyūm.',
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Maha Hidup, Yang terus-menerus mengurus (makhluk-Nya).',
    isBookmarked: false,
  },
  {
    id: '4', category: 'SORE',
    title: 'Dzikir Sore — Tasbih',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ × ١٠٠',
    transliteration: 'Subhānallāhi wa bihamdihī (100x)',
    translation: 'Maha Suci Allah dan dengan memuji-Nya. (100 kali)',
    isBookmarked: false,
  },
  {
    id: '5', category: 'TARAWIH',
    title: 'Doa Setelah Tarawih',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allāhumma innaka \'afuwwun tuḥibbul \'afwa fa\'fu \'annī.',
    translation: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf, mencintai kemaafan, maka maafkanlah aku.',
    isBookmarked: true,
  },
  {
    id: '6', category: 'LAILATUL_QADR',
    title: 'Doa Lailatul Qadr',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allāhumma innaka \'afuwwun karīmun tuḥibbul \'afwa fa\'fu \'annī.',
    translation: 'Ya Allah, sungguh Engkau Maha Pemaaf lagi Maha Mulia, Engkau suka memberi maaf, maka maafkanlah aku.',
    isBookmarked: false,
  },
];

const CATEGORIES = [
  { id: 'ALL', label: 'Semua', icon: '🌙' },
  { id: 'SAHUR', label: 'Sahur', icon: '🌄' },
  { id: 'IFTAR', label: 'Iftar', icon: '🌅' },
  { id: 'PAGI', label: 'Pagi', icon: '☀️' },
  { id: 'SORE', label: 'Sore', icon: '🌆' },
  { id: 'TARAWIH', label: 'Tarawih', icon: '🕌' },
  { id: 'LAILATUL_QADR', label: 'Lailatul Qadr', icon: '⭐' },
];

export default function DuaScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [duas, setDuas] = useState(DUAS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = duas.filter(d => {
    const matchCat = activeCategory === 'ALL' || d.category === activeCategory;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.translation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleBookmark = (id: string) => {
    Haptics.selectionAsync();
    setDuas(prev => prev.map(d =>
      d.id === id ? { ...d, isBookmarked: !d.isBookmarked } : d
    ));
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
              Koleksi Doa
            </Text>
            <Text style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: Typography.sizes['4xl'],
              color: colors.textPrimary,
            }}>
              Dua &{'\n'}Dzikir
            </Text>
          </MotiView>

          {/* Search Bar */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 150 }}
            style={{ marginTop: Spacing[4] }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing[3],
                backgroundColor: isDark ? colors.surface : colors.surfaceElevated,
                borderRadius: Radii.xl,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: Spacing[4],
                paddingVertical: Spacing[3],
              }}
            >
              <Text style={{ fontSize: 18 }}>🔍</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Cari doa..."
                placeholderTextColor={colors.textPlaceholder}
                style={{
                  flex: 1,
                  fontFamily: Typography.fonts.bodyRegular,
                  fontSize: Typography.sizes.md,
                  color: colors.textPrimary,
                }}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={{ fontSize: 16, color: colors.textTertiary }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </MotiView>
        </View>

        {/* ── Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: Spacing[5],
            gap: 8,
            paddingBottom: Spacing[2],
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <MotiView
              key={cat.id}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 40 }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveCategory(cat.id);
                }}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: activeCategory === cat.id
                      ? isDark ? colors.accent : colors.textPrimary
                      : isDark ? colors.surface : colors.surfaceElevated,
                    borderWidth: 1,
                    borderColor: activeCategory === cat.id
                      ? 'transparent' : colors.border,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                  <Text style={{
                    fontFamily: Typography.fonts.bodySemiBold,
                    fontSize: Typography.sizes.sm,
                    color: activeCategory === cat.id
                      ? isDark ? colors.textInverse : colors.textInverse
                      : colors.textSecondary,
                  }}>
                    {cat.label}
                  </Text>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </ScrollView>

        {/* ── Dua Cards */}
        <View style={{ paddingHorizontal: Spacing[4], marginTop: Spacing[2], gap: 12 }}>
          {filtered.map((dua, i) => (
            <Animated.View
              key={dua.id}
              entering={FadeInDown.delay(i * 80).springify()}
            >
              <DuaCard
                dua={dua}
                expanded={expandedId === dua.id}
                onExpand={() => {
                  Haptics.selectionAsync();
                  setExpandedId(expandedId === dua.id ? null : dua.id);
                }}
                onBookmark={() => toggleBookmark(dua.id)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Dua Card Component ───────────────────────────────────────────
function DuaCard({
  dua, expanded, onExpand, onBookmark,
}: {
  dua: typeof DUAS[0];
  expanded: boolean;
  onExpand: () => void;
  onBookmark: () => void;
}) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity onPress={onExpand} activeOpacity={0.9}>
      <MotiView
        animate={{
          backgroundColor: expanded
            ? isDark ? 'rgba(174,183,132,0.08)' : 'rgba(201,181,156,0.12)'
            : isDark ? '#1E2109' : '#FFFFFF',
        }}
        transition={{ type: 'timing', duration: 200 }}
        style={{
          borderRadius: Radii.xl,
          borderWidth: 1,
          borderColor: expanded ? (isDark ? 'rgba(174,183,132,0.3)' : colors.accent) : colors.border,
          overflow: 'hidden',
        }}
      >
        {/* Header Row */}
        <View style={{
          padding: Spacing[4],
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: Spacing[3],
        }}>
          <View style={{ flex: 1 }}>
            {/* Category badge */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
            }}>
              <Text style={{ fontSize: 12 }}>
                {CATEGORIES.find(c => c.id === dua.category)?.icon}
              </Text>
              <Text style={{
                fontFamily: Typography.fonts.bodyMedium,
                fontSize: Typography.sizes.xs,
                color: colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                {CATEGORIES.find(c => c.id === dua.category)?.label}
              </Text>
            </View>
            <Text style={{
              fontFamily: Typography.fonts.bodySemiBold,
              fontSize: Typography.sizes.md,
              color: colors.textPrimary,
            }}>
              {dua.title}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Bookmark */}
            <TouchableOpacity onPress={onBookmark}>
              <MotiView
                animate={{ scale: dua.isBookmarked ? [1.3, 1] : 1 }}
                transition={{ type: 'spring' }}
              >
                <Text style={{ fontSize: 20 }}>
                  {dua.isBookmarked ? '🔖' : '🏷️'}
                </Text>
              </MotiView>
            </TouchableOpacity>
            {/* Expand arrow */}
            <MotiView
              animate={{ rotate: expanded ? '90deg' : '0deg' }}
              transition={{ type: 'timing', duration: 200 }}
            >
              <Text style={{ fontSize: 18, color: colors.textTertiary }}>›</Text>
            </MotiView>
          </View>
        </View>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'timing', duration: 250 }}
            >
              <View
                style={{
                  borderTopWidth: 0.5,
                  borderColor: colors.border,
                  padding: Spacing[4],
                  gap: Spacing[3],
                }}
              >
                {/* Arabic text */}
                <View style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: Radii.lg,
                  padding: Spacing[4],
                }}>
                  <Text style={{
                    fontFamily: Typography.fonts.arabicRegular,
                    fontSize: Typography.sizes.arabicMd,
                    color: isDark ? colors.textPrimary : colors.textPrimary,
                    textAlign: 'right',
                    writingDirection: 'rtl',
                    lineHeight: Typography.lineHeights.arabicMd,
                  }}>
                    {dua.arabic}
                  </Text>
                </View>

                {/* Transliteration */}
                <Text style={{
                  fontFamily: Typography.fonts.displaySemiBold,
                  fontSize: Typography.sizes.md,
                  color: isDark ? colors.accent : colors.borderStrong,
                  fontStyle: 'italic',
                  lineHeight: 24,
                }}>
                  {dua.transliteration}
                </Text>

                {/* Translation */}
                <Text style={{
                  fontFamily: Typography.fonts.bodyRegular,
                  fontSize: Typography.sizes.sm,
                  color: colors.textSecondary,
                  lineHeight: 22,
                }}>
                  {dua.translation}
                </Text>

                {/* Focus mode button */}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/(modals)/dua-detail', params: { id: dua.id } })}
                  style={{
                    marginTop: 4,
                    paddingVertical: Spacing[3],
                    borderRadius: Radii.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: Typography.fonts.bodySemiBold,
                    fontSize: Typography.sizes.sm,
                    color: isDark ? colors.accent : colors.textSecondary,
                  }}>
                    🔍 Mode Fokus
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </MotiView>
    </TouchableOpacity>
  );
}
