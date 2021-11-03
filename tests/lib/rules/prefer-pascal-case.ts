/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

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
          type: 'Identifier',
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
