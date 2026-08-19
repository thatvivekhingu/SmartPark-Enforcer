export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep obsidian base — warm-tinted dark, not blue-navy
        ox: {
          950: '#080808',
          900: '#0C0C0E',
          850: '#111113',
          800: '#18181B',
          700: '#27272A',
          600: '#3F3F46',
          500: '#52525B',
        },
        // Amber — NEW primary accent
        am: {
          DEFAULT: '#F59E0B',
          100: '#FEF3C7',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          900: '#451A03',
          950: '#280F01',
        },
        // Ice cyan — live/data states
        ic: {
          DEFAULT: '#22D3EE',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          900: '#052532',
          950: '#021B25',
        },
        // Crimson — alerts/violations only
        cr: {
          DEFAULT: '#FF4444',
          300: '#FCA5A5',
          400: '#FF6B6B',
          500: '#FF4444',
          600: '#DC2626',
          950: '#1F0505',
        },
        // Jade — success/verified
        jade: {
          400: '#34D399',
          500: '#10B981',
          950: '#022C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card:   '0 0 0 1px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.5)',
        amber:  '0 0 20px rgba(245,158,11,0.2), 0 0 0 1px rgba(245,158,11,0.15)',
        cyan:   '0 0 16px rgba(34,211,238,0.2)',
        red:    '0 0 20px rgba(255,68,68,0.2)',
        glow:   '0 0 40px rgba(245,158,11,0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        blink: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.25 },
        },
        ringPulse: {
          '0%':   { boxShadow: '0 0 0 0 rgba(245,158,11,0.4)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(245,158,11,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245,158,11,0)' },
        },
        slideIn: {
          '0%':   { opacity: 0, transform: 'translateX(-8px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeUp:    'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both',
        scanline:  'scanline 4s linear infinite',
        shimmer:   'shimmer 1.8s linear infinite',
        blink:     'blink 1.2s ease-in-out infinite',
        ringPulse: 'ringPulse 2s ease-out infinite',
        slideIn:   'slideIn 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
