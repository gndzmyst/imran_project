// components/quran/QuranProgressMini.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, RoundedRect, LinearGradient as SkiaGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Typography, Spacing, Radii } from '@/constants/theme';

const { width: W } = Dimensions.get('window');
const CARD_W = W - Spacing[4] * 2;

export function QuranProgressMini() {
  const { colors, isDark } = useTheme();
  const currentPage = 152;
  const targetPage = 604;
  const progress = currentPage / targetPage;

  return (
    <View style={{
      borderRadius: Radii.card,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(10,196,224,0.15)' : 'rgba(11,45,114,0.12)',
    }}>
      {/* Skia bg */}
      <Canvas style={{ position: 'absolute', width: CARD_W, height: 90 }}>
        <RoundedRect x={0} y={0} width={CARD_W} height={90} r={20}>
          <SkiaGradient
            start={vec(0, 0)}
            end={vec(CARD_W, 90)}
            colors={isDark
              ? ['#0B2D72', '#1A1C0A']
              : ['#E3F2FD', '#F9F8F6']}
          />
        </RoundedRect>
      </Canvas>

      <View style={{
        padding: Spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing[4],
      }}>
        <Text style={{ fontSize: 32 }}>📖</Text>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: Typography.fonts.bodySemiBold,
            fontSize: Typography.sizes.sm,
            color: isDark ? 'rgba(10,196,224,0.8)' : 'rgba(11,45,114,0.8)',
            marginBottom: 4,
          }}>
            Target Khatam
          </Text>
          <View style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(11,45,114,0.10)',
            overflow: 'hidden',
          }}>
            <MotiView
              from={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: 'timing', duration: 1000 }}
              style={{
                height: '100%',
                borderRadius: 3,
                backgroundColor: isDark ? '#0AC4E0' : '#0B2D72',
              }}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 4,
          }}>
            <Text style={{
              fontFamily: Typography.fonts.monoRegular,
              fontSize: Typography.sizes.xs,
              color: isDark ? '#0AC4E0' : '#0B2D72',
            }}>
              {currentPage} / {targetPage} hal
            </Text>
            <Text style={{
              fontFamily: Typography.fonts.monoRegular,
              fontSize: Typography.sizes.xs,
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(11,45,114,0.5)',
            }}>
              {(progress * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
