const RuleTester = require('eslint').RuleTester

module.exports = new RuleTester({
  // eslint-disable-next-line node/no-unpublished-require
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 8,
    sourceType: 'module',
  },
})
