// app/_layout.tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useThemeStore } from '@/stores/themeStore';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import '../global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, setSystemTheme } = useThemeStore();

  const [fontsLoaded, fontError] = useFonts({
    // Cormorant Garamond — Elegant Display
    'Cormorant-Regular':   require('@/assets/fonts/CormorantGaramond-Regular.ttf'),
    'Cormorant-SemiBold':  require('@/assets/fonts/CormorantGaramond-SemiBold.ttf'),
    'Cormorant-Bold':      require('@/assets/fonts/CormorantGaramond-Bold.ttf'),
    'Cormorant-Italic':    require('@/assets/fonts/CormorantGaramond-Italic.ttf'),

    // Plus Jakarta Sans — Modern Body
    'PlusJakartaSans-Light':    require('@/assets/fonts/PlusJakartaSans-Light.ttf'),
    'PlusJakartaSans-Regular':  require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium':   require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold':     require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),

    // Amiri — Quranic Arabic
    'Amiri-Regular': require('@/assets/fonts/Amiri-Regular.ttf'),
    'Amiri-Bold':    require('@/assets/fonts/Amiri-Bold.ttf'),

    // JetBrains Mono — Numbers & Times
    'JetBrainsMono-Regular': require('@/assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold':    require('@/assets/fonts/JetBrainsMono-Bold.ttf'),
  });

  // Splash animation
  const splashOpacity = useSharedValue(1);
  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Animate out splash
      splashOpacity.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(SplashScreen.hideAsync)();
        }
      });
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (systemColorScheme) {
      setSystemTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <StatusBar
              style={theme === 'dark' ? 'light' : 'dark'}
              animated
            />
            <Stack screenOptions={{ headerShown: false }}>
              {/* Auth Group */}
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />

              {/* Main App Tabs */}
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />

              {/* Modals (full-screen) */}
              <Stack.Screen
                name="(modals)/dua-detail"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="(modals)/qiblah"
                options={{
                  presentation: 'fullScreenModal',
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(modals)/report"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />

              {/* Not Found */}
              <Stack.Screen name="+not-found" />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
