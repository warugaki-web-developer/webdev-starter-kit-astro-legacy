module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',

    /* ALL */
    'stylelint-config-html',
    /* OR */
    // 'stylelint-config-html/html',
    // 'stylelint-config-html/astro',
    // 'stylelint-config-html/vue',
    // 'stylelint-config-html/xml',
    // 'stylelint-config-html/svelte',
    // 'stylelint-config-html/php',
  ],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-no-vendor-prefix': [
      true,
      {
        ignoreSelectors: ['::placeholder', '/-moz-.*/'],
      },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['appearance', 'text-size-adjust', 'transform', 'columns'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.astro'],
      rules: {
        // 次の擬似クラスの使用を許可
        // :global()
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global'],
          },
        ],
      },
    },
  ],
};
