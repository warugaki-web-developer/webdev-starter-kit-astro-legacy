/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 80,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  htmlWhitespaceSensitivity: 'ignore',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: ['*.js', '*.mjs', '*.cjs'],
      options: {
        singleQuote: true,
      },
    },
    {
      files: ['*.css', '*.css', '*.scss'],
      options: {
        singleQuote: true,
      },
    },
    {
      files: '*.html',
      options: {
        printWidth: 160,
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        printWidth: 160,
      },
    },
  ],
};
