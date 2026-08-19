export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base palette — refined navy, not pure black
        base: {
          950: '#070B12',
          900: '#0B0F17',
          800: '#111827',
          700: '#1A2233',
          600: '#1E2A3B',
          500: '#253347',
        },
        // Single primary accent — electric blue
        primary: {
          DEFAULT: '#3B82F6',
          50:  '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          900: '#1E3A8A',
          950: '#0D1E47',
        },
        // Violation / alert — reserved only for violations & alerts
        danger: {
          DEFAULT: '#EF4444',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          950: '#2D0A0A',
        },
        // Success — used only for verified/OK states
        success: {
          DEFAULT: '#10B981',
          400: '#34D399',
          500: '#10B981',
          950: '#052E1C',
        },
        // Borders
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          muted:  'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.16)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm:  '6px',
        DEFAULT: '8px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        cardHover: '0 4px 12px rgba(0,0,0,0.5)',
        live:    '0 0 0 3px rgba(59,130,246,0.15), 0 0 20px rgba(59,130,246,0.08)',
        glow:    '0 0 16px rgba(59,130,246,0.25)',
        danger:  '0 0 16px rgba(239,68,68,0.15)',
        inset:   'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        glowRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59,130,246,0.3)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(59,130,246,0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeUp:    'fadeUp 0.4s ease-out both',
        shimmer:   'shimmer 1.6s linear infinite',
        pulseSlow: 'pulseSlow 2s ease-in-out infinite',
        glowRing:  'glowRing 2s ease-in-out infinite',
        spin:      'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
