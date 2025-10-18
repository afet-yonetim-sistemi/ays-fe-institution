/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},

    autoprefixer: {},

    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            minifyFontValues: true,
            minifySelectors: true,
            mergeLonghand: true,
            colormin: true,
          },
        ],
      },
    }),
  },
}

export default config
