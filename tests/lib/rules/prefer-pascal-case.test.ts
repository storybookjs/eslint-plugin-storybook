/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import dedent from 'ts-dedent'

import rule from '../../../lib/rules/prefer-pascal-case'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('prefer-pascal-case', rule, {
  valid: [
    'export const Primary = {}',
    'export const Primary: Story = {}',

    // @TODO: Support this use case - Non-story exports
    // `
    //   export default {
    //     excludeStories: /.*Data$/,
    //   }
    //   export const getData = () => { data: 123 }
    // `,
  ],

  invalid: [
    {
      code: dedent`
        export const primary = {}
        primary.foo = 'bar'
      `,
      errors: [
        {
          messageId: 'usePascalCase',
          data: {
            name: 'primary',
          },
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'convertToPascalCase',
              output: dedent`
                export const Primary = {}
                Primary.foo = 'bar'
              `,
            },
          ],
        },
      ],
    },
    {
      code: `export const primary: Story = {}`,
      errors: [
        {
          messageId: 'usePascalCase',
          data: {
            name: 'primary',
          },
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'convertToPascalCase',
              output: 'export const Primary: Story = {}',
            },
          ],
        },
      ],
    },
  ],
})
