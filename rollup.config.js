import babel from 'rollup-plugin-babel';

const meta = require('./package.json');

process.env.BABEL_ENV = 'rollup';

export default {
  entry: './src/index.js',
  targets: [
    { format: 'cjs', dest: meta.main, exports: 'named' },
    { format: 'es', dest: meta.module },
  ],

  external: Object.keys(meta.dependencies)
    .concat(Object.keys(meta.peerDependencies)),
  plugins: [
    babel(),
  ],
};
