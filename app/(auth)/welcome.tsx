// app/(auth)/welcome.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Circle, Blur, RoundedRect, LinearGradient as SkiaGradient, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { Typography, Spacing, Radii } from '@/constants/theme';

const { width: W, height: H } = Dimensions.get('window');

// Stars/particles
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * W,
  y: Math.random() * H * 0.7,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 3000,
  duration: Math.random() * 2000 + 2000,
}));

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const moonRise = useSharedValue(0);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    // Moon rise on mount
    moonRise.value = withDelay(300, withSpring(1, { damping: 14, stiffness: 60 }));
    // Glow pulse
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sine) }),
      ),
      -1, false
    );
  }, []);

  const moonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(moonRise.value, [0, 1], [60, 0]) },
    ],
    opacity: moonRise.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.3, 0.7]),
    transform: [{
      scale: interpolate(glowPulse.value, [0, 1], [0.95, 1.05]),
    }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: '#0D1117' }}>
      {/* ── Skia Night Sky Background */}
      <Canvas style={{ position: 'absolute', width: W, height: H }}>
        {/* Deep gradient sky */}
        <RoundedRect x={0} y={0} width={W} height={H} r={0}>
          <SkiaGradient
            start={vec(W / 2, 0)}
            end={vec(W / 2, H)}
            colors={['#0B2D72', '#141507', '#0D1117']}
          />
        </RoundedRect>

        {/* Moon glow orb */}
        <Circle cx={W * 0.65} cy={H * 0.25} r={100} color="rgba(232,213,163,0.06)">
          <Blur blur={30} />
        </Circle>
        <Circle cx={W * 0.65} cy={H * 0.25} r={60} color="rgba(232,213,163,0.08)">
          <Blur blur={20} />
        </Circle>

        {/* Horizon glow */}
        <Circle cx={W * 0.5} cy={H * 0.62} r={180} color="rgba(174,183,132,0.04)">
          <Blur blur={60} />
        </Circle>
      </Canvas>

      {/* ── Animated Stars */}
      {STARS.map((star) => (
        <MotiView
          key={star.id}
          from={{ opacity: 0 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            type: 'timing',
            duration: star.duration,
            loop: true,
            delay: star.delay,
          }}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            borderRadius: 999,
            backgroundColor: '#FFFFFF',
          }}
        />
      ))}

      {/* ── Moon & Crescent */}
      <Animated.View
        style={[
          moonStyle,
          {
            position: 'absolute',
            right: W * 0.12,
            top: H * 0.14,
            alignItems: 'center',
          },
        ]}
      >
        {/* Moon glow */}
        <Animated.View
          style={[
            glowStyle,
            {
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(232,213,163,0.15)',
            },
          ]}
        />
        {/* Crescent moon emoji */}
        <Text style={{ fontSize: 72 }}>🌙</Text>
      </Animated.View>

      {/* ── Main Content */}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: insets.bottom + Spacing[8],
          paddingHorizontal: Spacing[6],
        }}
      >
        {/* Arabic bismillah */}
        <Animated.Text
          entering={FadeIn.delay(600).duration(1000)}
          style={{
            fontFamily: Typography.fonts.arabicRegular,
            fontSize: Typography.sizes.arabicXl,
            color: 'rgba(174,183,132,0.35)',
            textAlign: 'center',
            writingDirection: 'rtl',
            marginBottom: Spacing[8],
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </Animated.Text>

        {/* App name */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text
            style={{
              fontFamily: Typography.fonts.displayBold,
              fontSize: 64,
              color: '#F3E8DF',
              lineHeight: 64,
              letterSpacing: -1,
            }}
          >
            Ramadhan
          </Text>
          <Text
            style={{
              fontFamily: Typography.fonts.displaySemiBold,
              fontSize: 64,
              color: '#AEB784',
              lineHeight: 64,
              letterSpacing: -1,
            }}
          >
            Mode.
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          entering={FadeInDown.delay(550).springify()}
          style={{
            fontFamily: Typography.fonts.bodyLight,
            fontSize: Typography.sizes.lg,
            color: 'rgba(232,213,163,0.65)',
            marginTop: Spacing[4],
            lineHeight: 26,
          }}
        >
          Teman ibadah digitalmu.{'\n'}Maksimalkan Ramadhan bersama kami.
        </Animated.Text>

        {/* Feature dots */}
        <Animated.View
          entering={FadeInDown.delay(650).springify()}
          style={{
            flexDirection: 'row',
            gap: Spacing[4],
            marginTop: Spacing[6],
          }}
        >
          {['🕌 Sholat', '📖 Tilawah', '📿 Dzikir'].map((f) => (
            <View
              key={f}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 0.5,
                borderColor: 'rgba(174,183,132,0.3)',
                backgroundColor: 'rgba(174,183,132,0.08)',
              }}
            >
              <Text style={{
                fontFamily: Typography.fonts.bodyMedium,
                fontSize: Typography.sizes.xs,
                color: '#AEB784',
              }}>
                {f}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View
          entering={FadeInUp.delay(750).springify()}
          style={{ marginTop: Spacing[8], gap: Spacing[3] }}
        >
          {/* Primary CTA */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.replace('/(tabs)');
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#AEB784', '#8A9460']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: Spacing[4],
                borderRadius: Radii.xl,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontFamily: Typography.fonts.bodySemiBold,
                fontSize: Typography.sizes.lg,
                color: '#141507',
                letterSpacing: 0.5,
              }}>
                Mulai Ramadhan 🌙
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              // Google OAuth
            }}
            activeOpacity={0.85}
            style={{
              paddingVertical: Spacing[4],
              borderRadius: Radii.xl,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(243,232,223,0.2)',
              backgroundColor: 'rgba(243,232,223,0.05)',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>G</Text>
            <Text style={{
              fontFamily: Typography.fonts.bodyMedium,
              fontSize: Typography.sizes.md,
              color: 'rgba(243,232,223,0.75)',
            }}>
              Lanjut dengan Google
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Terms */}
        <Animated.Text
          entering={FadeIn.delay(900)}
          style={{
            fontFamily: Typography.fonts.bodyRegular,
            fontSize: Typography.sizes.xs,
            color: 'rgba(243,232,223,0.3)',
            textAlign: 'center',
            marginTop: Spacing[4],
            lineHeight: 16,
          }}
        >
          Dengan melanjutkan, kamu menyetujui{'\n'}
          Kebijakan Privasi & Syarat Layanan kami.
        </Animated.Text>
      </View>
    </View>
  );
}
