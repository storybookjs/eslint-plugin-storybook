/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/default-exports'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('default-exports', rule, {
  valid: ["export default { title: 'Button', component: Button }"],

  invalid: [
    {
      code: 'export const Primary = () => <button>hello</button>',
      errors: [{ messageId: 'shouldHaveDefaultExport', type: 'Program' }],
    },
  ],
})
