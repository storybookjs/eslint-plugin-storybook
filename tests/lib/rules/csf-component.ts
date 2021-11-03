/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/csf-component'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
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
