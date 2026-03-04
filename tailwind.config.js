/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ─────────────────────────────────────────────
      // RAMADHAN MODE DESIGN SYSTEM
      // ─────────────────────────────────────────────
      colors: {
        // ── LIGHT THEME (Palette 1: Warm Cream)
        // #F9F8F6 / #EFE9E3 / #D9CFC7 / #C9B59C
        light: {
          bg:       '#F9F8F6',  // Cream white - main background
          surface:  '#EFE9E3',  // Soft beige - cards, surfaces
          muted:    '#D9CFC7',  // Medium tan - dividers, inactive
          accent:   '#C9B59C',  // Warm camel - accent, borders
          text:     '#2A1F14',  // Dark brown - primary text
          textSub:  '#7A6552',  // Medium brown - secondary text
          textFade: '#A8907A',  // Light brown - placeholder
        },
        // ── DARK THEME (Palette 4: Olive Night)
        // #41431B / #AEB784 / #E3DBBF / #F3E8DF
        dark: {
          bg:       '#1A1C0A',  // Deep olive black - main background
          surface:  '#272A10',  // Dark olive - cards, surfaces
          elevated: '#32360F',  // Elevated olive - modals, sheets
          muted:    '#4A4F18',  // Medium olive - dividers
          accent:   '#AEB784',  // Sage green - PRIMARY accent
          accentSoft:'#8A9460', // Darker sage - pressed state
          text:     '#F3E8DF',  // Warm white - primary text
          textSub:  '#C8BC9F',  // Muted cream - secondary text
          textFade: '#857A62',  // Faded cream - placeholder
        },
        // ── ADDITIONAL PALETTE (Palette 2: Ocean Blue)
        // #0B2D72 / #0992C2 / #0AC4E0 / #F6E7BC
        ocean: {
          deep:    '#0B2D72',
          mid:     '#0992C2',
          bright:  '#0AC4E0',
          sand:    '#F6E7BC',
        },
        // ── ADDITIONAL PALETTE (Palette 3: Warm Dark)
        // #452829 / #57595B / #E8D1C5 / #F3E8DF
        warm: {
          dark:    '#452829',
          slate:   '#57595B',
          blush:   '#E8D1C5',
          cream:   '#F3E8DF',
        },

        // ── SEMANTIC COLORS (works in both themes)
        success:  '#4CAF50',
        warning:  '#FF9800',
        error:    '#F44336',
        info:     '#2196F3',

        // ── RAMADHAN SPECIAL COLORS
        gold:     '#D4AF37',
        goldSoft: '#F0E68C',
        moon:     '#E8D5A3',
        night:    '#0D1117',
        prayer:   '#2E7D32',
        quran:    '#1565C0',
        dzikir:   '#6A1B9A',
      },

      fontFamily: {
        // Display / Heading - Cormorant Garamond (elegant, editorial)
        display:   ['Cormorant-Bold', 'serif'],
        displayMd: ['Cormorant-SemiBold', 'serif'],
        displayRg: ['Cormorant-Regular', 'serif'],

        // Body - Plus Jakarta Sans (modern, clean)
        sans:      ['PlusJakartaSans-Regular', 'sans-serif'],
        sansMd:    ['PlusJakartaSans-Medium', 'sans-serif'],
        sansSb:    ['PlusJakartaSans-SemiBold', 'sans-serif'],
        sansBd:    ['PlusJakartaSans-Bold', 'sans-serif'],

        // Arabic Text - Amiri (beautiful Quranic Arabic)
        arabic:    ['Amiri-Regular', 'serif'],
        arabicBd:  ['Amiri-Bold', 'serif'],

        // Mono - JetBrains Mono (for numbers, times)
        mono:      ['JetBrainsMono-Regular', 'monospace'],
        monoBd:    ['JetBrainsMono-Bold', 'monospace'],
      },

      fontSize: {
        'xs':   [12, { lineHeight: 16 }],
        'sm':   [14, { lineHeight: 20 }],
        'base': [16, { lineHeight: 24 }],
        'lg':   [18, { lineHeight: 28 }],
        'xl':   [20, { lineHeight: 28 }],
        '2xl':  [24, { lineHeight: 32 }],
        '3xl':  [30, { lineHeight: 36 }],
        '4xl':  [36, { lineHeight: 40 }],
        '5xl':  [48, { lineHeight: 52 }],
        '6xl':  [60, { lineHeight: 64 }],
        // Arabic specific
        'arabic-sm':   [20, { lineHeight: 36 }],
        'arabic-base': [26, { lineHeight: 44 }],
        'arabic-lg':   [32, { lineHeight: 52 }],
        'arabic-xl':   [40, { lineHeight: 64 }],
      },

      spacing: {
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'tab-height':  72,
      },

      borderRadius: {
        'none': '0',
        'sm':   4,
        'md':   8,
        'lg':   12,
        'xl':   16,
        '2xl':  20,
        '3xl':  28,
        '4xl':  36,
        'full': 9999,
        // Squircle-like
        'card': 20,
        'pill': 50,
      },

      boxShadow: {
        'card-light': '0 2px 16px rgba(201, 181, 156, 0.20)',
        'card-dark':  '0 2px 20px rgba(0, 0, 0, 0.40)',
        'glow-sage':  '0 0 20px rgba(174, 183, 132, 0.35)',
        'glow-gold':  '0 0 24px rgba(212, 175, 55, 0.40)',
        'glow-moon':  '0 0 32px rgba(232, 213, 163, 0.25)',
        'inner':      'inset 0 2px 8px rgba(0, 0, 0, 0.15)',
      },

      animation: {
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'bounce-subtle': 'bounce 2s ease-in-out infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'fade-in':       'fadeIn 0.4s ease-out forwards',
        'slide-up':      'slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards',
      },

      keyframes: {
        glow: {
          '0%':   { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
