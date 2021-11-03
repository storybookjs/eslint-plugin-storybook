/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/meta-inline-properties'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
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
            property: 'title',
          },
          type: 'Property',
        },
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'args',
          },
          type: 'Property',
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
            property: 'title',
          },
          type: 'Property',
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
            property: 'title',
          },
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const title = 'a'

        export default {
          title,
          component: Badge,
        } as ComponentMeta<typeof Badge>
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: 'Property',
        },
      ],
    },
    {
      code: `
        export default {
          title: someFunction(),
        }
      `,
      errors: [
        {
          messageId: 'metaShouldHaveInlineProperties',
          data: {
            property: 'title',
          },
          type: 'Property',
        },
      ],
    },
  ],
})
