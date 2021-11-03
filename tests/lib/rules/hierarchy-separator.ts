/**
 * @fileoverview Deprecated hierarchy separator
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/hierarchy-separator'
import ruleTester from '../../utils/rule-tester'

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
