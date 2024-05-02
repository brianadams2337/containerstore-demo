import plugin from 'tailwindcss/plugin'
import colors from 'tailwindcss/colors'
import breakpoints from './config/breakpoints'

const defaultSizes = {
  '6xs': '2rem',
  '5xs': '4rem',
  '4xs': '8rem',
  '3xs': '12rem',
  '2xs': '16rem',
  xs: '20rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '3xl': '48rem',
}

type Breakpoints = keyof typeof breakpoints

const screens = Object.entries(breakpoints).reduce(
  (acc, [breakpointName, size]) => {
    Object.assign(acc, { [breakpointName]: `${size}px` })
    return acc
  },
  {} as Record<Breakpoints, number>,
)

export default {
  content: ['modules/**/*.{vue,js, ts}'],
  theme: {
    screens,
    container: {
      center: true,
      padding: '1rem',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        gray: {
          50: '#f7f7f6',
          100: '#F2F2F2',
          200: '#F4F4F4',
          300: '#EAEAEA',
          350: '#E5E5E9',
          400: '#DDDDDD',
          500: '#CCCCCC',
          600: '#9b9b9b',
          700: '#888888',
          750: '#737277',
          800: '#666666',
        },

        primary: {
          100: '#404040',
          200: '#333',
          300: '#262626',
          400: '#191919',
          DEFAULT: '#1f1f21',
        },

        brand: {
          DEFAULT: '#14FFA8',
        },

        'pink-neon': '#ff7df4',
        flamingo: '#d891a8',
        'green-neon': '#00bd14',
        red: {
          ...colors.red,
          DEFAULT: '#f14949',
        },
        yellow: {
          ...colors.yellow,
          DEFAULT: '#ffd343',
        },
        pink: {
          ...colors.pink,
          DEFAULT: '#ff7df4',
        },
        purple: {
          ...colors.purple,
          DEFAULT: '#811fff',
        },
        blue: {
          50: '#5da8ff', // light-10
          100: '#c6e0ff', // light-20
          800: '#004ca5', // dark-10
          900: '#001732', // dark-20
          DEFAULT: '#0277ff',
        },
        secondary: {
          100: '#fbfbfb',
          200: '#fafafa',
          300: '#f9f9f9',
          400: '#f8f8f8',
          450: '#f2f0f0',
          DEFAULT: '#99989d',
          600: '#ebebeb',
          700: '#ccc',
          800: '#7f7f7f',
        },

        tertiary: {
          1: {
            500: '#00e4ff',
          },
          2: {
            500: '#ff9a00',
          },
          3: {
            500: '#e5ff00',
          },
        },
        status: {
          success: 'var(--status-success)',
          inactive: 'var(--status-inactive)',
          info: 'var(--status-info)',
        },
      },
      animation: {
        'ping-small': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      maxHeight: { ...defaultSizes },
      minHeight: { ...defaultSizes },
      maxWidth: {
        ...defaultSizes,
      },
      minWidth: {
        48: '12rem',
        '4xs': defaultSizes['4xs'],
        xs: defaultSizes.xs,
        md: defaultSizes.md,
        lg: defaultSizes.lg,
        xl: defaultSizes.xl,

        // percentage based
        '1/5': '20%',
      },
      keyframes: {
        ping: {
          '25%, 50%': { transform: 'scale(.8)', opacity: 10 },
        },
      },
      zIndex: {
        50: '50',
        60: '60',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const utilities = {
        '.top-white-shadow': {
          boxShadow: '0 -22px 10px 0 #fff',
        },
        '.anchor-scrolling-none': {
          overflowAnchor: 'none',
        },
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.search-decoration-none': {
          '&::-ms-clear': {
            display: 'none',
            width: '0',
            height: '0',
          },
          '&::-ms-reveal': {
            display: 'none',
            width: '0',
            height: '0',
          },
          '&::-webkit-search-decoration': {
            display: 'none',
          },
          '&::-webkit-search-cancel-button': {
            display: 'none',
          },
          '&::-webkit-search-results-button': {
            display: 'none',
          },
          '&::-webkit-search-results-decoration': {
            display: 'none',
          },
        },
        '.visually-hidden': {
          position: 'absolute',
          clip: 'rect(1px, 1px, 1px, 1px)',
          clipPath: 'inset(0 0 99.9% 99.9%)',
          overflow: 'hidden',
          height: '1px',
          width: '1px',
          padding: '0',
          border: '0',
        },
      }

      addUtilities(utilities)
    }),
  ],
}
