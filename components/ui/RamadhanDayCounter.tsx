// components/ui/RamadhanDayCounter.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from './ThemeProvider';
import { Typography, Radii } from '@/constants/theme';

interface Props { day: number }

export function RamadhanDayCounter({ day }: Props) {
  const { colors, isDark } = useTheme();
  const remaining = 30 - day;
  const progress = day / 30;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 250 }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Radii.pill,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(174,183,132,0.25)' : 'rgba(201,181,156,0.40)',
        backgroundColor: isDark ? 'rgba(174,183,132,0.08)' : 'rgba(201,181,156,0.12)',
      }}
    >
      <Text style={{ fontSize: 16 }}>🌙</Text>
      <Text style={{
        fontFamily: Typography.fonts.bodyMedium,
        fontSize: Typography.sizes.sm,
        color: isDark ? colors.accent : colors.textPrimary,
      }}>
        Hari ke-
        <Text style={{ fontFamily: Typography.fonts.monoBold }}>{day}</Text>
        {' '}Ramadhan
      </Text>
      <View style={{
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: isDark ? 'rgba(174,183,132,0.15)' : 'rgba(201,181,156,0.25)',
        overflow: 'hidden',
      }}>
        <MotiView
          from={{ width: '0%' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: 'timing', duration: 800, delay: 400 }}
          style={{
            height: '100%',
            borderRadius: 2,
            backgroundColor: isDark ? colors.accent : colors.textPrimary,
          }}
        />
      </View>
    </MotiView>
  );
}
