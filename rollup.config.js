import babel from '@rollup/plugin-babel';

const meta = require('./package.json');

export default {
  input: './src/index.js',
  output: [
    {
      format: 'cjs',
      file: meta.exports['.'].require,
      exports: 'named',
      sourcemap: true,
    },
    {
      format: 'esm',
      file: meta.exports['.'].import,
      sourcemap: true,
    },
  ],

  external: Object.keys(meta.dependencies)
    .concat(Object.keys(meta.peerDependencies)),
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
  ],
};
