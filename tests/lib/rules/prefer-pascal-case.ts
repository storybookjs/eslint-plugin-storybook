/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import rule from '../../../lib/rules/prefer-pascal-case'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('prefer-pascal-case', rule, {
  valid: ['export const Primary = {}'],

  invalid: [
    {
      code: 'export const primary = {}',
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
              output: 'export const Primary = {}',
            },
          ],
        },
      ],
    },
  ],
})
