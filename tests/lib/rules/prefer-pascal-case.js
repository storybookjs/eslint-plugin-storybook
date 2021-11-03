/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-pascal-case'),
  ruleTester = require('../../utils/rule-tester')

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
