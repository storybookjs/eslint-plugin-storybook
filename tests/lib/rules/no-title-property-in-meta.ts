/**
 * @fileoverview No title property in meta
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/no-title-property-in-meta'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
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
