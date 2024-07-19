import autoprefixer from 'autoprefixer';
import postcssGlobalData from '@csstools/postcss-global-data';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssGlobalData({
      files: ['./src/styles/modules/_custom-media-query.css'],
    }),
    postcssImport(),
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    }),
    autoprefixer(),
  ],
};
