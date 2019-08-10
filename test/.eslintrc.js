module.exports = {
  extends: '../.eslintrc.js',
  env: {
    mocha: true,
  },
  rules: {
    // We have good reasons
    'react/jsx-props-no-spreading': 'off',
  },
};
