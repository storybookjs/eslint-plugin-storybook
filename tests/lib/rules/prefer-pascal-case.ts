/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/prefer-pascal-case'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
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
