// app/(tabs)/_layout.tsx
import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Colors } from '@/constants/theme';

// ─── Custom Tab Bar Icons ─────────────────────────────────────────
const TabIcon = ({
  name,
  focused,
  color,
}: {
  name: string;
  focused: boolean;
  color: string;
}) => {
  const scale = useSharedValue(focused ? 1 : 0.92);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 0.92, {
      damping: 10,
      stiffness: 180,
    });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const icons: Record<string, { active: string; inactive: string }> = {
    index:    { active: '🕌',  inactive: '🕌' },
    ibadah:   { active: '📿',  inactive: '📿' },
    quran:    { active: '📖',  inactive: '📖' },
    dua:      { active: '🤲',  inactive: '🤲' },
    analytics:{ active: '📊',  inactive: '📊' },
  };

  const icon = icons[name] ?? { active: '⭕', inactive: '⭕' };

  return (
    <Animated.View style={animStyle}>
      <Text style={{ fontSize: 22 }}>
        {focused ? icon.active : icon.inactive}
      </Text>
    </Animated.View>
  );
};

// ─── Custom Tab Bar ───────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  const tabRoutes = ['index', 'ibadah', 'quran', 'dua', 'analytics'];
  const tabLabels: Record<string, string> = {
    index:     'Beranda',
    ibadah:    'Ibadah',
    quran:     'Qur\'an',
    dua:       'Dua',
    analytics: 'Laporan',
  };

  const handlePress = useCallback(
    (route: any, isFocused: boolean) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate(route.name);
      }
    },
    [navigation]
  );

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom,
        backgroundColor: 'transparent',
      }}
    >
      {/* Blur background - iOS */}
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={isDark ? 80 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
          }}
        />
      )}

      {/* Android fallback / solid bg */}
      {Platform.OS === 'android' && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: isDark
              ? 'rgba(20, 21, 7, 0.95)'
              : 'rgba(249, 248, 246, 0.97)',
          }}
        />
      )}

      {/* Top border */}
      <View
        style={{
          height: 0.5,
          backgroundColor: isDark ? colors.border : colors.divider,
        }}
      />

      {/* Tab items */}
      <View
        style={{
          flexDirection: 'row',
          height: 60,
          alignItems: 'center',
          paddingHorizontal: 8,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = tabLabels[route.name] ?? route.name;

          if (!tabRoutes.includes(route.name)) return null;

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={() => handlePress(route, isFocused)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <MotiView
                animate={{
                  backgroundColor: isFocused
                    ? isDark ? 'rgba(174, 183, 132, 0.12)' : 'rgba(201, 181, 156, 0.15)'
                    : 'transparent',
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <TabIcon
                  name={route.name}
                  focused={isFocused}
                  color={isFocused ? colors.tabActive : colors.tabInactive}
                />
                <Animated.Text
                  style={{
                    fontSize: 10,
                    fontFamily: isFocused
                      ? 'PlusJakartaSans-SemiBold'
                      : 'PlusJakartaSans-Regular',
                    color: isFocused ? colors.tabActive : colors.tabInactive,
                  }}
                >
                  {label}
                </Animated.Text>
              </MotiView>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index"     options={{ title: 'Beranda' }} />
      <Tabs.Screen name="ibadah"    options={{ title: 'Ibadah' }} />
      <Tabs.Screen name="quran"     options={{ title: "Qur'an" }} />
      <Tabs.Screen name="dua"       options={{ title: 'Dua' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Laporan' }} />
    </Tabs>
  );
}
