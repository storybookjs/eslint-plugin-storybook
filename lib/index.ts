/**
 * @fileoverview Best practice rules for Storybook
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const requireIndex = require('requireindex')

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
  rules: requireIndex(__dirname + '/rules'),
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
  configs: requireIndex(__dirname + '/configs'),
}
