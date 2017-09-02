import babel from 'rollup-plugin-babel';

const meta = require('./package.json');

process.env.BABEL_ENV = 'rollup';

export default {
  input: './src/index.js',
  output: [
    { format: 'cjs', file: meta.main, exports: 'named' },
    { format: 'es', file: meta.module },
  ],

  external: Object.keys(meta.dependencies)
    .concat(Object.keys(meta.peerDependencies)),
  plugins: [
    babel(),
  ],
};
