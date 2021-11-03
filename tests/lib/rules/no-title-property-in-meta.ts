/**
 * @fileoverview No title property in meta
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-title-property-in-meta'),
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-title-property-in-meta', rule, {
  valid: ['export default { component: Button }'],

  invalid: [
    {
      code: "export default { component: Button, title: 'Button' }",
      errors: [
        {
          messageId: 'noTitleInMeta',
          type: 'ExportDefaultDeclaration',
          suggestions: [
            {
              messageId: 'removeTitleInMeta',
              output: 'export default { component: Button,  }',
            },
          ],
        },
      ],
    },
  ],
})
