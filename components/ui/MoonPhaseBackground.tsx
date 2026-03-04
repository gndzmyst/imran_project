// components/ui/MoonPhaseBackground.tsx
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas, Circle, Blur, RoundedRect,
  LinearGradient as SkiaGradient, vec, Path, Skia,
} from '@shopify/react-native-skia';
import {
  useSharedValue, withRepeat, withTiming,
  Easing, useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from './ThemeProvider';

const { width: W, height: H } = Dimensions.get('window');
const CARD_H = 300;

// Random stars seed
const STARS = Array.from({ length: 24 }, (_, i) => ({
  x: (Math.sin(i * 137.5) * 0.5 + 0.5) * W,
  y: (Math.cos(i * 113.7) * 0.5 + 0.5) * CARD_H * 0.85,
  r: (Math.sin(i * 73) * 0.5 + 0.5) * 1.5 + 0.5,
}));

export function MoonPhaseBackground() {
  const { isDark } = useTheme();
  const pulse = useSharedValue(0);
  const starOpacity = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sine) }),
      -1, true,
    );
    starOpacity.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sine) }),
      -1, true,
    );
  }, []);

  const glowR = useDerivedValue(() => 60 + pulse.value * 15);
  const glowOpacity = useDerivedValue(() => 0.08 + pulse.value * 0.06);

  if (!isDark) {
    // Light theme: simple warm gradient, no stars
    return (
      <Canvas style={{ position: 'absolute', width: W, height: CARD_H }}>
        <RoundedRect x={0} y={0} width={W} height={CARD_H} r={0}>
          <SkiaGradient
            start={vec(0, 0)}
            end={vec(W, CARD_H)}
            colors={['#F9F8F6', '#EFE9E3', '#D9CFC7']}
          />
        </RoundedRect>
        {/* Subtle sun/warm orb */}
        <Circle cx={W * 0.75} cy={50} r={80} color="rgba(201,181,156,0.15)">
          <Blur blur={30} />
        </Circle>
      </Canvas>
    );
  }

  return (
    <Canvas style={{ position: 'absolute', width: W, height: CARD_H }}>
      {/* Sky gradient */}
      <RoundedRect x={0} y={0} width={W} height={CARD_H} r={0}>
        <SkiaGradient
          start={vec(W / 2, 0)}
          end={vec(W / 2, CARD_H)}
          colors={['#0B1D4E', '#141507', '#0D1117']}
        />
      </RoundedRect>

      {/* Moon glow */}
      <Circle cx={W * 0.72} cy={80} r={glowR} color={`rgba(232,213,163,${glowOpacity})`}>
        <Blur blur={25} />
      </Circle>
      <Circle cx={W * 0.72} cy={80} r={28} color="rgba(240,230,190,0.55)">
        <Blur blur={8} />
      </Circle>

      {/* Horizon olive glow */}
      <Circle cx={W * 0.5} cy={CARD_H * 0.85} r={150} color="rgba(174,183,132,0.04)">
        <Blur blur={50} />
      </Circle>

      {/* Stars */}
      {STARS.map((star, i) => (
        <Circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          color={`rgba(255,255,255,${0.3 + (i % 4) * 0.15})`}
        />
      ))}
    </Canvas>
  );
}
