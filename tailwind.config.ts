import type { Config } from 'tailwindcss';
function generateTemplateGridRowsOrCols(
  startValue: number,
  lastValue: number
): Record<string, string> {
  let obj = {};
  for (let i = startValue; i < lastValue; i++) {
    (obj as any)[`${i}`] = `repeat(${i}, minmax(0, 1fr))`;
  }
  return obj;
}

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/core/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        ...generateTemplateGridRowsOrCols(13, 100), // This generates the columns from 12 until 100
      },
      gridTemplateRows: {
        ...generateTemplateGridRowsOrCols(7, 100), // This generates the columns from 12 until 100
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        grayDark: '#1F1F1F',
        grayPrimary: '#131212',
        blackPrimary: 'rgba(19, 18, 18, 1)',
        paragraph: '#B3B3B3',
        border: 'hsl(var(--border))',
        whiteShade: '#F2F3F5',
        blueWhite: '#F5F8FA',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        accentBlue: {
          '50': '#E2EFFF',
          '100': '#B3D5FF',
          '300': '#347bd3',
          '400': '#2560AA',
          '500': '#1454A4',
          '900': '#0b2d58',
        },
        primaryGray: {
          '300': '#DEDEE0',
          '500': '#717172',
        },
        dark: {
          '500': '#2D2D2E',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['var(--font-helvetica)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
  ],
};
export default config;
