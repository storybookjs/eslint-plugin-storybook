/**
 * @fileoverview Deprecated hierarchy separator
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/hierarchy-separator'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('hierarchy-separator', rule, {
  valid: ["export default { title: 'Examples/Components/Button' }"],

  invalid: [
    {
      code: "export default { title: 'Examples|Components|Button' }",
      output: "export default { title: 'Examples/Components/Button' }",
      errors: [
        {
          type: 'ExportDefaultDeclaration',
          suggestions: [
            {
              messageId: 'useCorrectSeparators',
              output: "export default { title: 'Examples/Components/Button' }",
            },
          ],
        },
      ],
    },
    {
      code: "export default { title: 'Examples.Components.Button' }",
      output: "export default { title: 'Examples/Components/Button' }",
      errors: [
        {
          type: 'ExportDefaultDeclaration',
          suggestions: [
            {
              messageId: 'useCorrectSeparators',
              output: "export default { title: 'Examples/Components/Button' }",
            },
          ],
        },
      ],
    },
  ],
})
