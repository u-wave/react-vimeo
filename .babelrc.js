const ROLLUP = process.env.BABEL_ENV === 'rollup';
const TEST = process.env.BABEL_ENV === 'test';

module.exports = {
  presets: [
    ['env', {
      modules: TEST ? 'commonjs' : false,
      loose: true,
      targets: TEST ? { node: 'current' } : {},
    }],
    'react',
  ],
  plugins: [
    'transform-class-properties',
    ['transform-react-remove-prop-types', { mode: 'wrap' }],
    ROLLUP && 'external-helpers',
  ].filter(Boolean),
};
