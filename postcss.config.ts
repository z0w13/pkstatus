// https://github.com/michael-ciniawsky/postcss-load-config
import autoprefixer from 'autoprefixer';
import { Config } from 'postcss-load-config';

// NOTE: Can't directly use `export default` as we run into microsoft/TypeScript#58176 otherwise
//       explicitly declaring the config type like this fixes
//       the "The inferred type of 'default' cannot be named" error
const config: Config = {
  plugins: [
    // https://github.com/postcss/autoprefixer
    autoprefixer({
      overrideBrowserslist: [
        'last 4 Chrome versions',
        'last 4 Firefox versions',
        'last 4 Edge versions',
        'last 4 Safari versions',
        'last 4 Android versions',
        'last 4 ChromeAndroid versions',
        'last 4 FirefoxAndroid versions',
        'last 4 iOS versions',
      ],
    }),

    // https://github.com/elchininet/postcss-rtlcss
    // If you want to support RTL css, then
    // 1. yarn/npm install postcss-rtlcss
    // 2. optionally set quasar.config.js > framework > lang to an RTL language
    // 3. uncomment the following line:
    // require('postcss-rtlcss')
  ],
};

export default config;
