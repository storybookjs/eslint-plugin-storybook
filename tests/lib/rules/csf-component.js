/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/csf-component'),
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('csf-component', rule, {
  valid: [
    "export default { title: 'Button', component: Button }",
    "export default { title: 'Button', component: Button } as ComponentMeta<typeof Button>",
  ],

  invalid: [
    {
      code: "export default { title: 'Button' }",
      errors: [
        {
          messageId: 'missingComponentProperty',
          type: 'ExportDefaultDeclaration',
        },
      ],
    },
    {
      code: "export default { title: 'Button' } as Meta<typeof Button>",
      errors: [
        {
          messageId: 'missingComponentProperty',
          type: 'ExportDefaultDeclaration',
        },
      ],
    },
  ],
})
