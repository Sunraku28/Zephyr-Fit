/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: 'var(--color-void)',
        'void-2': 'var(--color-void-2)',
        panel: 'var(--color-panel)',
        'panel-2': 'var(--color-panel-2)',
        'panel-border': 'var(--color-panel-border)',
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
          DEFAULT: 'var(--color-text)',
          dim: 'var(--color-text-dim)',
          dimmer: 'var(--color-text-dimmer)',
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