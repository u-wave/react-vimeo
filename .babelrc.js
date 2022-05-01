module.exports = (api) => {
  const isTest = api.caller((caller) => caller.name === '@babel/register');

  return {
    targets: isTest ? { node: 'current' } : {},
    presets: [
      ['@babel/env', {
        modules: isTest ? 'commonjs' : false,
      }],
      '@babel/react',
    ],
  };
};
