/**
 * @fileoverview Use expect from &#39;@storybook/expect&#39;
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/use-storybook-expect'
import ruleTester from '../../utils/rule-tester'
import dedent from 'ts-dedent'
import { AST_NODE_TYPES } from '@typescript-eslint/types'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('use-storybook-expect', rule, {
  valid: [
    dedent`
      import { expect } from '@storybook/jest';

      Default.play = () => {
        expect(123).toEqual(123);
      }
    `,
    dedent`
      import { expect } from '@storybook/jest';

      export const Basic = {
        ...Default,
        play: async (context) => {
          expect(123).toEqual(123);
        },
      };
    `,
  ],

  invalid: [
    {
      code: dedent`
        Default.play = () => {
          expect(123).toEqual(123);
        }
      `,
      output: dedent`
        import { expect } from '@storybook/jest';
        Default.play = () => {
          expect(123).toEqual(123);
        }
      `,
      errors: [
        {
          messageId: 'useExpectFromStorybook',
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'updateImports',
              output: dedent`
                import { expect } from '@storybook/jest';
                Default.play = () => {
                  expect(123).toEqual(123);
                }
              `,
            },
          ],
        },
      ],
    },
    {
      code: dedent`
        const someInteraction = () => {
          expect(123).toEqual(123);
        }
        Default.play = someInteraction
      `,
      output: dedent`
        import { expect } from '@storybook/jest';
        const someInteraction = () => {
          expect(123).toEqual(123);
        }
        Default.play = someInteraction
      `,
      errors: [
        {
          messageId: 'useExpectFromStorybook',
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'updateImports',
              output: dedent`
                import { expect } from '@storybook/jest';
                const someInteraction = () => {
                  expect(123).toEqual(123);
                }
                Default.play = someInteraction
              `,
            },
          ],
        },
      ],
    },
    {
      code: dedent`
        export const Basic = {
          ...Default,
          play: async (context) => {
            expect(123).toEqual(123);
          },
        };
      `,
      output: dedent`
        import { expect } from '@storybook/jest';
        export const Basic = {
          ...Default,
          play: async (context) => {
            expect(123).toEqual(123);
          },
        };
      `,
      errors: [
        {
          messageId: 'useExpectFromStorybook',
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'updateImports',
              output: dedent`
                import { expect } from '@storybook/jest';
                export const Basic = {
                  ...Default,
                  play: async (context) => {
                    expect(123).toEqual(123);
                  },
                };
              `,
            },
          ],
        },
      ],
    },
  ],
})
