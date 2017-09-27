const rc = require('../.babelrc');

module.exports = Object.assign({}, rc, {
  plugins: [
    ...rc.plugins,
    'transform-es2015-modules-commonjs',
  ],
});
