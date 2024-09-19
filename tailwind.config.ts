import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/core/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        grayDark: '#1F1F1F',
        grayPrimary: '#131212',
        blackPrimary: "rgba(19, 18, 18, 1)",
        paragraph: "#B3B3B3",
        border: "hsla(0,0,100%,16%)",
        whiteShade: '#F2F3F5',
        blueWhite: '#F5F8FA',
        accent: '#CBA22E',
        accentBlue: {
          50: '#E2EFFF',
          100: '#B3D5FF',
          300: '#347bd3',
          400: '#2560AA',
          500: '#1454A4',
          900: '#0b2d58',
        },
        primaryGray: {
          300: '#DEDEE0',
          500: '#717172',
        },
        dark: {
          500: '#2D2D2E',
        },
      },
      fontFamily: {
        sans: ['var(--font-helvetica)'],
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
export default config;
