/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Rubik Mono One', 'monospace'],
        'silkscreen': ['Silkscreen', 'monospace'],
      },
      colors: {
        'neon-purple': '#8B5CF6',
        'neon-blue': '#6366F1',
        'neon-green': '#10B981',
        'dark-bg': '#000000',
        'dark-card': '#0A0A0A',
        'dark-border': '#1A1A1A',
        'purple-glow': '#7C3AED',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px #7C3AED' },
          '100%': { boxShadow: '0 0 30px #7C3AED, 0 0 40px #7C3AED' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};