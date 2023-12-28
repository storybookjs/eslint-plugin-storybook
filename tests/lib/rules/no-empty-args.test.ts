/**
 * @fileoverview Empty args is meaningless and should not be used
 * @author yinm
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import dedent from 'ts-dedent'
import rule from '../../../lib/rules/no-empty-args'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-empty-args', rule, {
  valid: [
    // CSF3
    `
      export default {
        component: Button,
      }
    `,
    "export const PrimaryButton = { args: { foo: 'bar' } }",
    "export const PrimaryButton: Story = { args: { foo: 'bar' } }",
    `
      const Default = {}
      export const PrimaryButton = { ...Default, args: { foo: 'bar' } }
    `,
  ],
  invalid: [
    // CSF3
    {
      code: dedent`
        export default {
          component: Button,
          args: {}
        }
      `,
      errors: [
        {
          messageId: 'detectEmptyArgs',
          type: AST_NODE_TYPES.Property,
          suggestions: [
            {
              messageId: 'removeEmptyArgs',
              output: dedent`
                export default {
                  component: Button,
                  
                }
              `,
            },
          ],
        },
      ],
    },
    {
      code: 'export const PrimaryButton = { args: {} }',
      errors: [
        {
          messageId: 'detectEmptyArgs',
          type: AST_NODE_TYPES.Property,
          suggestions: [
            {
              messageId: 'removeEmptyArgs',
              output: 'export const PrimaryButton = {  }',
            },
          ],
        },
      ],
    },
  ],
})
