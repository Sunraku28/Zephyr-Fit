/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#06060b',
        'void-2': '#0c0c14',
        panel: 'rgba(255,255,255,.04)',
        'panel-2': 'rgba(255,255,255,.07)',
        'panel-border': 'rgba(255,255,255,.10)',
        mint: {
          DEFAULT: '#00e89d',
          soft: 'rgba(0,232,157,.25)',
        },
        rose: {
          DEFAULT: '#ff4d8a',
          soft: 'rgba(255,77,138,.25)',
        },
        gold: {
          DEFAULT: '#ffc857',
          soft: 'rgba(255,200,87,.25)',
        },
        orange: '#ff8c3d',
        red: '#ff4d5e',
        green: {
          DEFAULT: '#00e89d',
          soft: 'rgba(0,232,157,.25)',
        },
        text: {
          DEFAULT: '#ebebeb',
          dim: '#8a8a96',
          dimmer: '#4e4e5a',
        }
      },
      fontFamily: {
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};