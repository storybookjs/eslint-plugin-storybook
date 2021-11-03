// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const RuleTester = require('eslint').RuleTester

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = new RuleTester({
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  // eslint-disable-next-line node/no-unpublished-require
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 8,
    sourceType: 'module',
  },
})
