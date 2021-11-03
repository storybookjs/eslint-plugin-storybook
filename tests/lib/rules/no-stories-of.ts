/**
 * @fileoverview storiesOf is deprecated and should not be used
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/no-stories-of'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-stories-of', rule, {
  valid: [
    `
      import Button from '../components/Button';
      export default {
        title: 'Button',
        component: Button
      }

      export const Primary = () => <Button primary />
    `,
  ],

  invalid: [
    {
      code: `
        import { storiesOf } from '@storybook/react';
        import Button from '../components/Button';

        storiesOf('Button', module)
          .add('primary', () => <Button primary />)
      `,
      errors: [
        {
          messageId: 'doNotUseStoriesOf',
          type: 'ImportSpecifier',
        },
      ],
    },
  ],
})
