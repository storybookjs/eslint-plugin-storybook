/**
 * @fileoverview Empty args is meaningless and should not be used
 * @author yinm
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/no-empty-args'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-empty-args', rule, {
  /**
   * 👉 Please read this and delete this entire comment block.
   * This is an example test for a rule that reports an error in case a named export is called 'wrong'
   * Use https://eslint.org/docs/developer-guide/working-with-rules for Eslint API reference
   */
  valid: ['export const correct = {}'],
  invalid: [
    {
      code: 'export const wrong = {}',
      errors: [
        {
          messageId: 'anyMessageIdHere', // comes from the rule file
        },
      ],
    },
  ],
})