/**
 * @fileoverview No title property in meta
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import rule from '../../../lib/rules/no-title-property-in-meta'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-title-property-in-meta', rule, {
  valid: ['export default { component: Button }'],

  invalid: [
    {
      code: "export default { component: Button, title: 'Button' }",
      errors: [
        {
          messageId: 'noTitleInMeta',
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          suggestions: [
            {
              messageId: 'removeTitleInMeta',
              output: 'export default { component: Button,  }',
            },
          ],
        },
      ],
    },
  ],
})
