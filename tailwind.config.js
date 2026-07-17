/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#05070d',
        'void-2': '#0a0f1e',
        panel: 'rgba(14,19,33,.58)',
        'panel-2': 'rgba(14,19,33,.82)',
        'panel-border': 'rgba(150,170,255,.16)',
        cyan: {
          DEFAULT: '#2fe6ff',
          soft: 'rgba(47,230,255,.35)',
        },
        purple: {
          DEFAULT: '#b24bff',
          soft: 'rgba(178,75,255,.38)',
        },
        orange: '#ff8c3d',
        red: '#ff4d5e',
        green: {
          DEFAULT: '#35ffa0',
          soft: 'rgba(53,255,160,.35)',
        },
        text: {
          DEFAULT: '#eaf0ff',
          dim: '#8b93ad',
          dimmer: '#565f78',
        }
      },
      fontFamily: {
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};