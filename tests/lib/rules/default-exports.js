/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/default-exports'),
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('default-exports', rule, {
  valid: ["export default { title: 'Button', component: Button }"],
  invalid: [
    {
      code: 'export const Primary = () => 123',
      errors: [{ message: 'The file should have a default export.', type: 'Program' }],
    },
  ],
})
