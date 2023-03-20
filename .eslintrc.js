module.exports = {
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // I disagree
    'react/jsx-filename-extension': 'off',
    // I disagree
    'react/require-default-props': 'off',
    // Our babel config doesn't support class properties
    'react/state-in-constructor': 'off',
    // I disagree
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'jsx-a11y/label-has-for': ['error', {
      components: [],
      required: {
        some: ['nesting', 'id'],
      },
      allowChildren: false,
    }],
  },
};
