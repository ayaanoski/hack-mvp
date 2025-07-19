/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Merged font families
      fontFamily: {
        'mono': ['Rubik Mono One', 'monospace'],
        'silkscreen': ['Silkscreen', 'monospace'],
      },

      // Merged colors
      colors: {
        'neon-purple': '#8B5CF6',
        'neon-blue': '#6366F1',
        'neon-green': '#10B981',
        'dark-bg': '#000000',
        'dark-card': '#0A0A0A',
        'dark-border': '#1A1A1A',
        'purple-glow': '#7C3AED',
      },

      // Merged animations
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'move-diagonal-1': 'moveDiagonal1 15s linear infinite',
        'move-diagonal-2': 'moveDiagonal2 20s linear infinite',
        'move-diagonal-3': 'moveDiagonal3 18s linear infinite',
        'move-horizontal-1': 'moveHorizontal1 25s linear infinite',
        'move-horizontal-2': 'moveHorizontal2 30s linear infinite',
        'move-vertical-1': 'moveVertical1 22s linear infinite',
        'fade-in-down': 'fade-in-down 0.3s ease-out forwards', // Added from the second snippet
      },

      // Merged keyframes
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #7C3AED' },
          '100%': { boxShadow: '0 0 30px #7C3AED, 0 0 40px #7C3AED' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        moveDiagonal1: {
          '0%': { transform: 'translate(-100px, 100px)' },
          '100%': { transform: 'translate(calc(100vw + 100px), calc(-100vh - 100px))' },
        },
        moveDiagonal2: {
          '0%': { transform: 'translate(100px, -100px)' },
          '100%': { transform: 'translate(calc(-100vw - 100px), calc(100vh + 100px))' },
        },
        moveDiagonal3: {
          '0%': { transform: 'translate(50px, -50px)' },
          '100%': { transform: 'translate(calc(-100vw - 50px), calc(100vh + 50px))' },
        },
        moveHorizontal1: {
          '0%': { transform: 'translateX(-100vw)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        moveHorizontal2: {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100vw)' },
        },
        moveVertical1: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'fade-in-down': { // Added from the second snippet
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};