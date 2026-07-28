/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#09090b',
        darkcard: '#121215',
        cardborder: '#27272a',
        electric: {
          cyan: '#06b6d4',
          cyanGlow: '#00f0ff',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.35)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.35)',
        'red-glow': '0 0 20px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
