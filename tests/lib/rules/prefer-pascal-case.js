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
          message: 'The story should use PascalCase notation: primary',
          type: 'Identifier',
          suggestions: [{ output: 'export const Primary = {}' }],
        },
      ],
    },
  ],
})
