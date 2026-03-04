# 🌙 Ramadhan Mode — Frontend Setup Guide

> All-in-One Spiritual Companion App  
> Stack: **Expo Router** + **NativeWind v4** + **Reanimated 3** + **Moti** + **React Native Skia**

---

## 🎨 Design System

### Color Palettes

| Theme | Palette | Usage |
|-------|---------|-------|
| **Light** | Warm Cream `#F9F8F6` → `#C9B59C` | Soft, warm, comfortable |
| **Dark**  | Olive Night `#141507` → `#AEB784` | Rich, deep, elegant |
| **Ocean** | `#0B2D72` → `#0AC4E0` | Quran section accent |
| **Warm**  | `#452829` → `#F3E8DF` | Special sections |

### Typography

| Role | Font | Sizes |
|------|------|-------|
| Display/Heading | **Cormorant Garamond** (Elegant Serif) | 36–60px |
| Body | **Plus Jakarta Sans** (Modern Humanist) | 12–20px |
| Arabic | **Amiri** (Traditional Naskh) | 20–44px |
| Numbers/Times | **JetBrains Mono** | 12–60px |

---

## 📁 Project Structure

```
ramadhan-mode/
├── app/
│   ├── _layout.tsx              # Root layout, fonts, providers
│   ├── (auth)/
│   │   └── welcome.tsx          # Onboarding + login screen
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Custom animated tab bar
│   │   ├── index.tsx            # 🏠 Home / Beranda
│   │   ├── ibadah.tsx           # 📿 Ibadah Tracker
│   │   ├── quran.tsx            # 📖 Quran Target
│   │   ├── dua.tsx              # 🤲 Dua & Dzikir
│   │   └── analytics.tsx        # 📊 Analytics & Report
│   └── (modals)/
│       ├── dua-detail.tsx       # Focus reading modal
│       ├── qiblah.tsx           # Qibla direction
│       └── report.tsx           # Ramadhan report
│
├── components/
│   ├── ui/
│   │   ├── ThemeProvider.tsx    # Dark/light theme context
│   │   ├── StreakBadge.tsx      # 🔥 Streak display
│   │   ├── MoonPhaseBackground.tsx  # Skia animated bg
│   │   └── RamadhanDayCounter.tsx   # Day pill
│   ├── prayer/
│   │   └── PrayerCountdownCard.tsx  # Main prayer card
│   ├── ibadah/
│   │   └── IbadahChecklist.tsx      # Checklist grid
│   └── quran/
│       └── QuranProgressMini.tsx    # Progress card
│
├── stores/
│   ├── themeStore.ts            # Zustand theme state
│   └── ibadahStore.ts           # Zustand ibadah state
│
├── hooks/
│   └── usePrayerTimes.ts        # Adhan library hook
│
├── constants/
│   └── theme.ts                 # Full design tokens
│
├── global.css                   # NativeWind base styles
├── tailwind.config.js           # Full Tailwind config
├── babel.config.js
├── app.json
└── tsconfig.json
```

---

## 🚀 Quick Start

```bash
# 1. Clone & install
npm install

# 2. Download fonts (required)
# Place in /assets/fonts/:
# - CormorantGaramond-Regular/SemiBold/Bold/Italic.ttf
# - PlusJakartaSans-Light/Regular/Medium/SemiBold/Bold.ttf
# - Amiri-Regular.ttf + Amiri-Bold.ttf
# - JetBrainsMono-Regular.ttf + JetBrainsMono-Bold.ttf
#
# Free sources:
# Cormorant Garamond: https://fonts.google.com/specimen/Cormorant+Garamond
# Plus Jakarta Sans:  https://fonts.google.com/specimen/Plus+Jakarta+Sans
# Amiri:              https://www.amirifont.org/
# JetBrains Mono:     https://www.jetbrains.com/lp/mono/

# 3. Start dev
npx expo start

# 4. Run on device
npx expo run:android
npx expo run:ios
```

---

## 📦 Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| `expo-router` | ~4.0 | File-based navigation |
| `nativewind` | ^4.1 | Tailwind CSS for RN |
| `react-native-reanimated` | ~3.16 | 60fps native animations |
| `moti` | ^0.30 | Declarative animations |
| `@shopify/react-native-skia` | ^1.5 | GPU-rendered backgrounds |
| `react-native-gesture-handler` | ~2.21 | Gesture interactions |
| `expo-blur` | ~14.0 | iOS blur effect |
| `expo-haptics` | ~14.0 | Tactile feedback |
| `expo-linear-gradient` | ~14.0 | Gradient backgrounds |
| `adhan` | ^4.4 | Prayer time calculation |
| `zustand` + `immer` | ^5 + ^10 | State management |
| `react-native-mmkv` | ^3.1 | Fast local storage |
| `@gorhom/bottom-sheet` | ^5.1 | Bottom sheets |
| `victory-native` | ^41 | Charts & analytics |
| `lottie-react-native` | ^7.1 | Lottie animations |
| `@tanstack/react-query` | ^5.62 | API data fetching |

---

## 🌙 Dark / Light Mode

The app defaults to **dark mode** (Olive Night palette), which is the intended primary experience. Light mode (Warm Cream palette) is fully supported and switches automatically based on system preference, or manually via settings.

### Dark Mode Colors
- Background: `#141507` (deep olive black)  
- Surface: `#1E2109` (dark olive)  
- Accent: `#AEB784` (sage green) ← primary brand color  
- Text: `#F3E8DF` (warm white)

### Light Mode Colors
- Background: `#F9F8F6` (cream white)
- Surface: `#EFE9E3` (soft beige)
- Accent: `#C9B59C` (warm camel)
- Text: `#2A1F14` (dark brown)

---

## ✨ Animation Architecture

```
Screen Enter    → FadeInDown + springify() via Reanimated
Scroll Parallax → useAnimatedScrollHandler + interpolate
Prayer Pulse    → withRepeat + withSequence (native thread)
Moon Glow       → Skia Canvas + useDerivedValue
Tab Press       → withSpring scale + Moti background
Card Toggle     → withSpring + ZoomIn entering
Progress Bars   → Moti width from 0% → target%
Stars Twinkle   → Moti opacity loop animation
```

---

## 🔮 Next Steps (Phase 2+)

- [ ] Notification scheduling (Expo Notifications)
- [ ] Qibla direction compass (device sensors)
- [ ] Prayer method settings screen
- [ ] Google OAuth integration
- [ ] API integration (replace mock data)
- [ ] Ramadhan Report PDF export
- [ ] Lottie celebration animations
- [ ] Sound adzan player
- [ ] Widget (iOS/Android home screen widget)
