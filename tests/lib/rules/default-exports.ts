/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/default-exports'
import ruleTester from '../../utils/rule-tester'

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
