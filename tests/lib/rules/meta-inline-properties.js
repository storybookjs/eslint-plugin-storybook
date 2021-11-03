/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/meta-inline-properties'),
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('meta-inline-properties', rule, {
  valid: ["export default { title: 'Button', args: { primary: true } }"],

  invalid: [
    {
      code: `
        const title = 'foo';
        const args = { a: 1 };
        export default { title, args };
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            properties: 'title, args',
          },
          type: 'ExportDefaultDeclaration',
        },
      ],
    },
    {
      code: `
        export default { title: 'a' + 123 };
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            properties: 'title',
          },
          type: 'ExportDefaultDeclaration',
        },
      ],
    },
    {
      code: `
        export default { title: \`a \${123}\` };
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            properties: 'title',
          },
          type: 'ExportDefaultDeclaration',
        },
      ],
    },
  ],
})
