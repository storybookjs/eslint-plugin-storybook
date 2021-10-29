/**
 * @fileoverview Use expect from &#39;@storybook/expect&#39;
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-storybook-expect'),
  ruleTester = require('../../utils/rule-tester'),
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
      code: dedent(`Default.play = () => {
            expect(123).toEqual(123);
          }`),
      errors: [
        {
          message:
            'Do not use expect from jest directly in the story. You should use from `@storybook/jest` instead.',
          type: 'CallExpression',
          suggestions: [
            {
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
