/**
 * @fileoverview Use expect from &#39;@storybook/expect&#39;
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


import rule from '../../../lib/rules/use-storybook-expect'
import ruleTester from '../../utils/rule-tester',

  dedent = require('ts-dedent').dedent

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('use-storybook-expect', rule, {
  valid: [
    dedent(`
      import { expect } from '@storybook/jest';

      Default.play = () => {
        expect(123).toEqual(123);
      }
    `),
  ],

  invalid: [
    {
      code: dedent(`
        Default.play = () => {
          expect(123).toEqual(123);
        }
      `),
      output: dedent(`
        import { expect } from '@storybook/jest';
        Default.play = () => {
          expect(123).toEqual(123);
        }
      `),
      errors: [
        {
          messageId: 'useExpectFromStorybook',
          type: 'CallExpression',
          suggestions: [
            {
              messageId: 'updateImports',
              output: dedent(`
                import { expect } from '@storybook/jest';
                Default.play = () => {
                  expect(123).toEqual(123);
                }
              `),
            },
          ],
        },
      ],
    },
  ],
})
