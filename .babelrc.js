const TEST = process.env.BABEL_ENV === 'test';

module.exports = {
  presets: [
    ['@babel/env', {
      modules: TEST ? 'commonjs' : false,
      loose: true,
      targets: TEST ? { node: 'current' } : {},
    }],
    '@babel/react',
  ],
};
