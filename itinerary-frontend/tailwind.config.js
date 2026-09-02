/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12201E',
          soft: '#16241F',
        },
        surface: {
          DEFAULT: '#1B2B28',
          raised: '#233634',
          hair: '#2C423E',
        },
        parchment: {
          DEFAULT: '#F3ECDA',
          dim: '#E9DFC6',
          text: '#1C2622',
        },
        route: {
          DEFAULT: '#4FA491',
          soft: '#3B7E70',
          bright: '#6FC4B0',
        },
        waypoint: {
          DEFAULT: '#DE9F52',
          soft: '#C6863B',
        },
        muted: '#8AA69E',
        danger: '#C4614C',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        stub: '4px',
        ticket: '18px',
      },
      boxShadow: {
        ticket: '0 1px 0 rgba(0,0,0,0.25)',
      },
      keyframes: {
        'draw-route': {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'draw-route': 'draw-route 1.1s ease-out forwards',
        'rise-in': 'rise-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};