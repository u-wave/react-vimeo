import fs from 'fs';
import babel from '@rollup/plugin-babel';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

process.env.BABEL_ENV = 'rollup';

export default {
  input: './src/index.js',
  output: [
    {
      format: 'cjs',
      file: pkg.exports['.'].require,
      exports: 'named',
      sourcemap: true,
    },
    {
      format: 'esm',
      file: pkg.exports['.'].import,
      sourcemap: true,
    },
  ],

  external: Object.keys(pkg.dependencies)
    .concat(Object.keys(pkg.peerDependencies)),
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
  ],
};
