// constants/theme.ts
// ─────────────────────────────────────────────────────────────
// RAMADHAN MODE — Complete Design Token System
// ─────────────────────────────────────────────────────────────

export const Colors = {
  // ── LIGHT THEME (Warm Cream Palette)
  light: {
    // Backgrounds
    background:       '#F9F8F6',
    surface:          '#EFE9E3',
    surfaceElevated:  '#FFFFFF',
    surfaceMuted:     '#D9CFC7',

    // Borders & Dividers
    border:           '#D9CFC7',
    borderStrong:     '#C9B59C',
    divider:          '#E8E2DC',

    // Text
    textPrimary:      '#2A1F14',
    textSecondary:    '#7A6552',
    textTertiary:     '#A8907A',
    textPlaceholder:  '#C4AE98',
    textInverse:      '#F9F8F6',

    // Primary Accent
    accent:           '#C9B59C',
    accentSoft:       '#E8D5C0',
    accentPress:      '#B89A80',

    // Special
    gold:             '#C4982A',
    goldSoft:         '#F5E6B0',
    prayer:           '#2E7D32',
    quran:            '#1565C0',
    dzikir:           '#6A1B9A',
    error:            '#C62828',
    success:          '#2E7D32',
    warning:          '#E65100',

    // Tab Bar
    tabActive:        '#2A1F14',
    tabInactive:      '#A8907A',
    tabBg:            '#F9F8F6',
    tabBorder:        '#D9CFC7',
  },

  // ── DARK THEME (Olive Night Palette)
  dark: {
    // Backgrounds
    background:       '#141507',
    surface:          '#1E2109',
    surfaceElevated:  '#272B0D',
    surfaceMuted:     '#313715',

    // Borders & Dividers
    border:           '#3A4018',
    borderStrong:     '#4E5520',
    divider:          '#2A2F10',

    // Text
    textPrimary:      '#F3E8DF',
    textSecondary:    '#C8BC9F',
    textTertiary:     '#8A7F67',
    textPlaceholder:  '#5C5440',
    textInverse:      '#141507',

    // Primary Accent
    accent:           '#AEB784',  // Sage green
    accentSoft:       '#CDD4A5',
    accentPress:      '#8A9460',

    // Special
    gold:             '#D4AF37',
    goldSoft:         '#3D3010',
    prayer:           '#81C784',
    quran:            '#64B5F6',
    dzikir:           '#CE93D8',
    error:            '#EF9A9A',
    success:          '#A5D6A7',
    warning:          '#FFCC80',

    // Tab Bar
    tabActive:        '#AEB784',
    tabInactive:      '#5C5440',
    tabBg:            '#141507',
    tabBorder:        '#2A2F10',
  },

  // ── SHARED (both themes)
  shared: {
    transparent:      'transparent',
    overlay:          'rgba(0,0,0,0.5)',
    overlayLight:     'rgba(0,0,0,0.2)',
    moonGlow:         'rgba(232, 213, 163, 0.12)',
    sageGlow:         'rgba(174, 183, 132, 0.15)',
  },
} as const;

export const Typography = {
  fonts: {
    // ── Display (Cormorant Garamond - Elegant Serif)
    displayBold:     'Cormorant-Bold',
    displaySemiBold: 'Cormorant-SemiBold',
    displayRegular:  'Cormorant-Regular',
    displayItalic:   'Cormorant-Italic',

    // ── Body (Plus Jakarta Sans - Modern Humanist)
    bodyRegular:     'PlusJakartaSans-Regular',
    bodyMedium:      'PlusJakartaSans-Medium',
    bodySemiBold:    'PlusJakartaSans-SemiBold',
    bodyBold:        'PlusJakartaSans-Bold',
    bodyLight:       'PlusJakartaSans-Light',

    // ── Arabic (Amiri - Traditional Naskh)
    arabicRegular:   'Amiri-Regular',
    arabicBold:      'Amiri-Bold',

    // ── Mono (JetBrains Mono - for times & numbers)
    monoRegular:     'JetBrainsMono-Regular',
    monoBold:        'JetBrainsMono-Bold',
  },

  sizes: {
    // Scale
    xs:   12,
    sm:   14,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    // Arabic-specific (larger for readability)
    arabicSm:   20,
    arabicMd:   26,
    arabicLg:   34,
    arabicXl:   44,
  },

  lineHeights: {
    xs:   16,
    sm:   20,
    md:   24,
    lg:   28,
    xl:   28,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
    '5xl': 56,
    '6xl': 68,
    arabicSm:   36,
    arabicMd:   44,
    arabicLg:   56,
    arabicXl:   70,
  },

  weights: {
    light:    '300' as const,
    regular:  '400' as const,
    medium:   '500' as const,
    semiBold: '600' as const,
    bold:     '700' as const,
    extraBold:'800' as const,
  },
} as const;

export const Spacing = {
  0:   0,
  1:   4,
  2:   8,
  3:   12,
  4:   16,
  5:   20,
  6:   24,
  7:   28,
  8:   32,
  10:  40,
  12:  48,
  14:  56,
  16:  64,
  20:  80,
  24:  96,
  tab: 80,       // Bottom tab height
  header: 56,    // Header height
} as const;

export const Radii = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   18,
  '2xl': 24,
  '3xl': 32,
  card: 20,
  pill: 999,
  full: 9999,
} as const;

export const Shadows = {
  light: {
    card: {
      shadowColor:   '#C9B59C',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius:  12,
      elevation:     4,
    },
    glow: {
      shadowColor:   '#C9B59C',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.30,
      shadowRadius:  20,
      elevation:     8,
    },
  },
  dark: {
    card: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.45,
      shadowRadius:  16,
      elevation:     8,
    },
    glow: {
      shadowColor:   '#AEB784',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius:  24,
      elevation:     12,
    },
    goldGlow: {
      shadowColor:   '#D4AF37',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.40,
      shadowRadius:  28,
      elevation:     16,
    },
  },
} as const;

// ── Prayer Time Colors (Contextual)
export const PrayerColors = {
  Fajr:    { primary: '#1A237E', secondary: '#283593', icon: '🌙' },
  Sunrise: { primary: '#E65100', secondary: '#F57C00', icon: '🌅' },
  Dhuhr:   { primary: '#F9A825', secondary: '#FBC02D', icon: '☀️' },
  Asr:     { primary: '#558B2F', secondary: '#689F38', icon: '🌤️' },
  Maghrib: { primary: '#AD1457', secondary: '#C2185B', icon: '🌆' },
  Isha:    { primary: '#4527A0', secondary: '#512DA8', icon: '🌃' },
} as const;

// ── Ibadah Category Colors
export const IbadahColors = {
  SHOLAT:  { bg: '#E8F5E9', text: '#1B5E20', icon: '🕌' },
  QURAN:   { bg: '#E3F2FD', text: '#0D47A1', icon: '📖' },
  CHARITY: { bg: '#FFF8E1', text: '#E65100', icon: '💛' },
  DZIKIR:  { bg: '#F3E5F5', text: '#4A148C', icon: '📿' },
  OTHER:   { bg: '#ECEFF1', text: '#37474F', icon: '✨' },
} as const;
