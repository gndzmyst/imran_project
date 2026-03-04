// components/ui/StreakBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './ThemeProvider';
import { Typography, Radii } from '@/constants/theme';

interface Props {
  count: number;
  size?: 'sm' | 'lg';
}

export function StreakBadge({ count, size = 'sm' }: Props) {
  const { isDark } = useTheme();
  const isLg = size === 'lg';

  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 200 }}
    >
      <LinearGradient
        colors={['#FF7043', '#FF5722']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: isLg ? 6 : 4,
          paddingHorizontal: isLg ? 14 : 10,
          paddingVertical: isLg ? 8 : 6,
          borderRadius: Radii.pill,
        }}
      >
        <Text style={{ fontSize: isLg ? 18 : 14 }}>🔥</Text>
        <Text style={{
          fontFamily: Typography.fonts.monoBold,
          fontSize: isLg ? Typography.sizes.lg : Typography.sizes.sm,
          color: '#FFFFFF',
          letterSpacing: 0.5,
        }}>
          {count}
        </Text>
        {isLg && (
          <Text style={{
            fontFamily: Typography.fonts.bodyRegular,
            fontSize: Typography.sizes.xs,
            color: 'rgba(255,255,255,0.8)',
          }}>
            hari
          </Text>
        )}
      </LinearGradient>
    </MotiView>
  );
}
