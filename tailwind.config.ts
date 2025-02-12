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
  safelist: [
    'overflow-hidden',
    'font-semibold',
    {
      pattern: /duration-\d+/,
    },
  ],
  theme: {
    screens,
    container: {
      center: true,
      padding: '1rem',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    aspectRatio: {
      '4/3': '4 / 3',
      '3/4': '3 / 4',
      '9/4': '9 / 4',
      video: '16 / 9',
      square: '1/1',
      auto: 'auto',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      variable: '425',
      medium: '500',
      'semi-bold-variable': '550',
      semibold: '600',
      bold: '700',
    },
    keyframes: {
      ping: {
        '25%, 50%': { transform: 'scale(.8)', opacity: 10 },
      },
      pulse: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 },
      },
    },
    outlineWidth: {
      0: '0',
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
    },
    outlineOffset: {
      0: '0',
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
      5: '5px',
      6: '6px',
    },
    zIndex: {
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      60: '60',
      70: '70',
      80: '90',
      90: '90',
      100: '100',
      110: '110',
      auto: 'auto',
    },
    fontSize: {
      '3xs': [
        '0.5rem',
        {
          lineHeight: '0.75rem',
          letterSpacing: '0.006rem',
        },
      ],
      '2xs': [
        '0.625rem',
        {
          lineHeight: '0.875rem',
          letterSpacing: '0.006rem',
        },
      ],
      xs: [
        '0.688rem',
        {
          lineHeight: '0.963rem',
          letterSpacing: '0',
        },
      ],
      sm: [
        '0.75rem',
        {
          lineHeight: '0.963rem',
          letterSpacing: '-0.008rem',
        },
      ],
      base: [
        '0.813rem',
        {
          lineHeight: '0.975rem',
          letterSpacing: '-0.008rem',
        },
      ],
      md: [
        '0.875rem',
        {
          lineHeight: '1.05rem',
          letterSpacing: '-0.009rem',
        },
      ],
      lg: [
        '1rem',
        {
          lineHeight: '1.2rem',
          letterSpacing: '-0.02rem',
        },
      ],
      xl: [
        '1.125rem',
        {
          lineHeight: '1.35rem',
          letterSpacing: '0.034rem',
        },
      ],
      '2xl': [
        '1.25rem',
        {
          lineHeight: '1.75rem',
          letterSpacing: '-0.025rem',
        },
      ],
      '3xl': [
        '1.75rem',
        {
          lineHeight: '2.1rem',
          letterSpacing: '-0.035rem',
        },
      ],

      '4xl': [
        '2.25rem',
        {
          lineHeight: '2.75rem',
          letterSpacing: '-0.045rem',
        },
      ],
      '5xl': [
        '2.75rem',
        {
          lineHeight: '3.063rem',
          letterSpacing: '-0.055rem',
        },
      ],
      '6xl': [
        '3.25rem',
        {
          lineHeight: '3.625rem',
          letterSpacing: '-0.063rem',
        },
      ],
    },
    extend: {
      lineHeight: {
        '3.5': '13px',
        '2.5': '10px',
      },
      borderWidth: {
        5: '5px',
      },
      borderRadius: {
        base: '4px',
        10: '10px',
      },
      height: {
        '4.5': '1.125rem',
        13: '3.25rem',
        15: '3.75rem',
        22: '5.5rem',
        26: '6.5rem',
        76: '19rem',
      },
      width: {
        13: '3.25rem',
        15: '3.75rem',
        88: '22rem',
        105: '26.25rem',
        128: defaultSizes.lg,
      },
      size: {
        13: '3.25rem',
        15: '3.75rem',
      },
      boxShadow: {
        secondary: '0 6px 16px -10px rgba(0, 0, 0, 0.04)',
        'inner-solid': 'inset 0 0 0 4px #193146',
        'inner-solid-sm': 'inset 0 0 0 2px #193146',
        'outer-solid': '0 0 0 3px #193146',
        'input-label': 'inset 0 2px 8px -10px #ccc, inset 0 2px 8px -10px #ccc',
      },
      colors: {
        emerald: {
          100: '#CEF5E8',
          300: '#14ffa8',
          400: '#00e48c',
          500: '#0dcc8d',
        },
        indigo: {
          200: '#ccbff6',
          500: '#5328e1',
        },
        gray: {
          ...colors.gray,
          50: '#fafafa',
          100: '#f2f2f2',
          200: '#ebebeb',
          300: '#d9d9d9',
          350: '#E5E5E9',
          400: '#a8a8a8',
          500: '#808080',
          600: '#666666',
          700: '#888888',
          750: '#737277',
          900: '#171717',
        },
        brand: {
          DEFAULT: '#14FFA8',
        },
        'pink-neon': '#ff7df4',
        flamingo: '#d891a8',
        'green-neon': '#00bd14',
        red: {
          ...colors.red,
          DEFAULT: '#d93321',
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
          850: '#193146', // dark-15
          900: '#001732', // dark-20
          DEFAULT: '#0277ff',
        },
        primary: {
          100: '#404040',
          200: '#333',
          300: '#262626',
          400: '#191919',
          DEFAULT: '#171717',
        },
        secondary: {
          100: '#fbfbfb',
          200: '#fafafa',
          300: '#f9f9f9',
          400: '#f8f8f8',
          450: '#f2f0f0',
          600: '#ebebeb',
          700: '#ccc',
          800: '#7f7f7f',
          DEFAULT: '#666666',
        },
        accent: {
          DEFAULT: '#5328e1',
          600: '#7247ff',
        },
        white: {
          smoke: '#f6f6f6',
          DEFAULT: '#ffffff',
        },
        status: {
          success: '#0dcc8d',
          error: '#d93321',
          info: '#ccbff6',
          alert: '#f59e0b',
          inactive: 'var(--status-inactive)',
        },
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      maxHeight: {
        ...defaultSizes,
        dialog: '94vh',
      },
      minHeight: { ...defaultSizes },
      maxWidth: {
        ...defaultSizes,
        screen: '100vw',
        dialog: '94vw',
        156: '39rem',
        112: '28rem',
        88: '22rem',
      },
      minWidth: {
        48: '12rem',
        '4xs': defaultSizes['4xs'],
        xs: defaultSizes.xs,
        md: defaultSizes.md,
        lg: defaultSizes.lg,
        xl: defaultSizes.xl,
        125: '31.25rem',
        '30.5': '7.625rem',
        // percentage based
        '1/5': '20%',
      },
      spacing: {
        11: '2.625rem  ',
        13: '3.25rem',
      },
      animation: {
        'ping-small': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        grow: 'grow 0.3s forwards',
        shrink: 'shrink 0.3s forwards',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addVariant, addBase }) => {
      const autofillStyles = {
        '-webkit-box-shadow': '0 0 0 30px #fff inset !important',
        '-webkit-text-fill-color': '#000 !important',
      }
      const utilities = {
        '.input-white-autofill': {
          '&:-webkit-autofill': {
            ...autofillStyles,
            '&:hover': autofillStyles,
            '&:focus': autofillStyles,
            '&:active': autofillStyles,
          },
        },
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
        '.transition-discrete': {
          'transition-behavior': 'allow-discrete',
        },
        '.diagonal-strikethrough': {
          background:
            'linear-gradient(to left top, transparent 49%, currentColor, currentColor, transparent 52.25%)',
        },
        '.scroll-shadow': {
          background: `/* Shadow Cover TOP */
            linear-gradient(
              white 30%,
              rgba(255, 255, 255, 0)
            ) center top,

            /* Shadow Cover BOTTOM */
            linear-gradient(
              rgba(255, 255, 255, 0),
              white 70%
            ) center bottom,

            /* Shadow TOP */
            radial-gradient(
              farthest-side at 50% 0,
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0)
            ) center top,

            /* Shadow BOTTOM */
            radial-gradient(
              farthest-side at 50% 100%,
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0)
            ) center bottom;
          `,
          'background-repeat': `no-repeat`,
          'background-size': `100% 40px, 100% 40px, 100% 14px, 100% 14px`,
          'background-attachment': `local, local, scroll, scroll`,
        },
      }
      addUtilities(utilities)
      // https://github.com/tailwindlabs/tailwindcss/pull/12040
      addVariant('starting', '@starting-style')
      addVariant('loaded', 'body.loaded &')
      // Allow styling the marker of <summary/>
      addVariant('marker', [
        '&::marker',
        '& *::marker',
        '&::-webkit-details-marker',
        '& *::-webkit-details-marker',
      ])
      addVariant('supports-hover', ['@media(hover:hover)'])

      // Add reset for search input fields on safari
      addBase({
        '[type="search"]::-webkit-search-decoration': { display: 'none' },
        '[type="search"]::-webkit-search-cancel-button': { display: 'none' },
        '[type="search"]::-webkit-search-results-button': { display: 'none' },
        '[type="search"]::-webkit-search-results-decoration': {
          display: 'none',
        },
      })
    }),
  ],
}
