const plugin = require('tailwindcss/plugin');
const mergeWith = require('lodash/mergeWith');

const variantsExtend = mergeWith(
  {
    margin: ['not-last', 'children-not-last'],
    backgroundColor: ['children-hover', 'children-active'],
    borderWidth: ['children-not-last'],
  },
  addChildren(
    'backgroundColor',
    'margin', 'padding',
    'borderWidth', 'borderRadius',
    'textColor',
    'transitionProperty', 'transitionDuration',
  ),
  (result, source) => Array.isArray(result) ? result.concat(source) : undefined
);

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: '0 3px 3px 0 #0003',
      },
      backgroundImage: {
        'login-img': "url('./assets/background.jpg')",
      },
      colors: {
        primary: {
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        secondary: {
          DEFAULT: '#1F2937',
          dark: '#030419',
          light: '#374151',
        },
        danger: '#D8320D',
        additional: '#DBB66F',
      },
      lineHeight: {
        none: '0'
      },
    },
  },
  variants: {
    extend: variantsExtend,
  },
  plugins: [
    require('tailwindcss-children'),
    plugin(({addVariant, e}) => {
      addVariant('not-last', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => `.${e(`not-last${separator}${className}`)}:not(:last-child)`);
      });
    }),
  ],
}

function addChildren(...list) {
  return list.reduce(
    (result, key) => {
      result[key] = ['children'];
      return result;
    },
    {}
  );
}