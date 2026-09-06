/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0C1412',
          soft: '#101B18',
        },
        surface: {
          DEFAULT: '#141F1C',
          hover: '#1A2925',
          elevated: '#182420',
          border: '#223330',
        },
        text: {
          DEFAULT: '#EDF3F0',
          muted: '#8FA39C',
          faint: '#5E736C',
        },
        accent: {
          DEFAULT: '#4FBF9F',
          hover: '#63D4B3',
          subtle: 'rgba(79,191,159,0.12)',
        },
        warn: {
          DEFAULT: '#E8A34D',
          subtle: 'rgba(232,163,77,0.12)',
        },
        danger: {
          DEFAULT: '#E2685A',
          subtle: 'rgba(226,104,90,0.12)',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)',
        modal: '0 24px 64px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(79,191,159,0.4), 0 0 24px -4px rgba(79,191,159,0.35)',
      },
      keyframes: {
        'draw-route': {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'draw-route': 'draw-route 1.1s ease-out forwards',
        'rise-in': 'rise-in 0.25s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};