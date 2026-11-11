/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nexbg: '#050B1A',
        nexcard: '#0A1428',
        nexcardHover: '#0F1E3A',
        nexblue: '#087BFF',
        nexcyan: '#00E5FF',
        nexpurple: '#873BFF',
        nexgreen: '#00D68F',
        nexwarning: '#FFB020',
        nexdanger: '#FF4560',
        nextext: '#F4F7FF',
        nexmuted: '#8A99AD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.35)',
        'glow-blue': '0 0 25px rgba(8, 123, 255, 0.4)',
        'glow-purple': '0 0 25px rgba(135, 59, 255, 0.35)',
        'glow-green': '0 0 20px rgba(0, 214, 143, 0.35)',
        'glow-danger': '0 0 20px rgba(255, 69, 96, 0.4)',
      },
    },
  },
  plugins: [],
};
