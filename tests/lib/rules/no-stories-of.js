/**
 * @fileoverview storiesOf is deprecated and should not be used
 * @author Yann Braga
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-stories-of"),
  ruleTester = require('../../utils/rule-tester')


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run("no-stories-of", rule, {
  valid: [
    `
      import Button from '../components/Button';
      export default {
        title: 'Button',
        component: Button
      }

      export const Primary = () => <Button primary />
    `
  ],

  invalid: [
    {
      code: `
        import { storiesOf } from '@storybook/react';
        import Button from '../components/Button';

        storiesOf('Button', module)
          .add('primary', () => <Button primary />)
      `,
      errors: [{ message: "storiesOf is deprecated and should not be used", type: "ImportSpecifier" }],
    },
  ],
});
