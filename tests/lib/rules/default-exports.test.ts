/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'

import rule from '../../../lib/rules/default-exports'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('default-exports', rule, {
  valid: [
    "export default { title: 'Button', component: Button }",
    "export default { title: 'Button', component: Button } as ComponentMeta<typeof Button>",
    `
      const meta = { title: 'Button', component: Button }
      export default meta
    `,
    `
      const meta: ComponentMeta<typeof Button> = { title: 'Button', component: Button }
      export default meta
    `,
  ],

  invalid: [
    {
      code: 'export const Primary = () => <button>hello</button>',
      errors: [
        {
          messageId: 'shouldHaveDefaultExport',
          type: AST_NODE_TYPES.Program,
        },
      ],
    },
  ],
})
