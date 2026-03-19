import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#8B5CF6',
          'purple-light': '#EDE9FE',
          teal: '#14B8A6',
          'teal-light': '#CCFBF1',
          orange: '#F97316',
          'orange-light': '#FFEDD5',
          pink: '#EC4899',
          'pink-light': '#FCE7F3',
          yellow: '#F59E0B',
          'yellow-light': '#FEF3C7',
          blue: '#3B82F6',
          'blue-light': '#DBEAFE',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(139, 92, 246, 0.1)',
        'card-hover': '0 8px 32px rgba(139, 92, 246, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
