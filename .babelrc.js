const TEST = process.env.BABEL_ENV === 'test';
const CJS = process.env.BABEL_ENV === 'cjs';

module.exports = {
  presets: [
    ['@babel/env', {
      modules: TEST || CJS ? 'commonjs' : false,
      loose: true,
      targets: TEST ? { node: 'current' } : {},
    }],
    '@babel/react',
  ],
};
