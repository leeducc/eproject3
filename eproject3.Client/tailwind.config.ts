import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',      // or 'media' if you prefer auto‑based on OS
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    // add any other paths where you write markup
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            pre: {
              whiteSpace: 'pre-wrap',
              wordBreak:  'break-word',
              overflowX:  'hidden',
            },
            code: {
              whiteSpace: 'pre-wrap',
              wordBreak:  'break-word',
            },
            'code::before': { content: '""' },
            'code::after':  { content: '""' },
          },
        },
        dark: {
          css: {
            // force all text dark in dark mode
            color: theme('colors.gray.900'),
            // links
            a: {
              color: theme('colors.link-dark.dark'),
              '&:hover': { color: theme('colors.link-dark.DEFAULT') },
            },
            // headings
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
            },
            // code blocks
            code: {
              backgroundColor: theme('colors.blue.50'),
              color: theme('colors.blue.500'),
            },
            pre: {
              backgroundColor: theme('colors.gray.100'),
              overflowX: 'auto',
            },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.300'),
              backgroundColor: theme('colors.gray.50'),
            },
            // remove any inverted dark‑mode overrides
            'strong, b': { color: theme('colors.gray.900') },
          },
        },
      }),
      colors: {
        'link-dark': {
          DEFAULT: '#087EA4',
          dark:    '#149ECA',
        },
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // …your other color tokens…
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' }},
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' }},
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    typography,
    // …any other plugins you use…
  ],
}

export default config
