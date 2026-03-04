// components/ibadah/IbadahChecklist.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import Animated, { ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/components/ui/ThemeProvider';
import { useIbadahStore, IbadahItem } from '@/stores/ibadahStore';
import { Typography, Spacing, Radii, IbadahColors } from '@/constants/theme';

interface Props {
  items: IbadahItem[];
  horizontal?: boolean;
}

export function IbadahChecklist({ items, horizontal }: Props) {
  const { colors, isDark } = useTheme();
  const { toggleIbadah, updateNumericIbadah } = useIbadahStore();

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing[5], gap: 10 }}
      >
        {items.map((item, i) => (
          <MiniCard
            key={item.id}
            item={item}
            index={i}
            onPress={() => {
              if (!item.isNumeric) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleIbadah(item.id);
              }
            }}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={{ gap: 8, paddingHorizontal: Spacing[4] }}>
      {items.map((item, i) => (
        <MiniCard
          key={item.id}
          item={item}
          index={i}
          onPress={() => {
            if (!item.isNumeric) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleIbadah(item.id);
            }
          }}
        />
      ))}
    </View>
  );
}

function MiniCard({
  item, index, onPress,
}: { item: IbadahItem; index: number; onPress: () => void }) {
  const { colors, isDark } = useTheme();
  const isCompleted = item.isNumeric
    ? (item.value as number) > 0
    : item.value === true;

  const catColors = IbadahColors[item.category];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', delay: index * 70 }}
        style={{
          width: 90,
          height: 90,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderWidth: 1,
          borderColor: isCompleted
            ? isDark ? 'rgba(174,183,132,0.35)' : 'rgba(201,181,156,0.50)'
            : colors.border,
          backgroundColor: isCompleted
            ? isDark ? 'rgba(174,183,132,0.10)' : 'rgba(201,181,156,0.15)'
            : isDark ? colors.surface : colors.surfaceElevated,
        }}
      >
        <Text style={{ fontSize: 24, opacity: isCompleted ? 1 : 0.6 }}>
          {item.icon}
        </Text>
        <Text style={{
          fontFamily: Typography.fonts.bodyMedium,
          fontSize: 11,
          color: isCompleted ? colors.textPrimary : colors.textTertiary,
          textAlign: 'center',
        }}>
          {item.nameId}
        </Text>
        {isCompleted && (
          <Animated.View
            entering={ZoomIn.duration(200)}
            style={{
              position: 'absolute',
              top: 8, right: 8,
              width: 18, height: 18,
              borderRadius: 9,
              backgroundColor: isDark ? colors.accent : colors.textPrimary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: isDark ? '#141507' : '#FFF' }}>✓</Text>
          </Animated.View>
        )}
      </MotiView>
    </TouchableOpacity>
  );
}
