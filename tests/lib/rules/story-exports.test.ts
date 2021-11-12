/**
 * @fileoverview A story file must contain at least one story export
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import dedent from 'ts-dedent'
import rule from '../../../lib/rules/story-exports'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('story-exports', rule, {
  valid: [
    'export const Primary = {}',
    `
      export default {}
      export const Primary = {}
    `,
    `
      export default {} as ComponentMeta<typeof RestaurantDetailPage>
      export const Primary = {}
    `,
    `
      import { storiesOf } from '@storybook/react'
      storiesOf('MyComponent', module)
    `,
  ],
  invalid: [
    {
      code: dedent`
        export default {
          component: Button
        } as ComponentMeta<typeof RestaurantDetailPage>`,
      output: dedent`
        export default {
          component: Button
        } as ComponentMeta<typeof RestaurantDetailPage>

        export const Default = {}
      `,
      errors: [
        {
          messageId: 'shouldHaveStoryExport',
        },
      ],
    },
    {
      code: dedent`
        export default {
          excludeStories: /.*Data$/,
        }

        export const mockData = {}
      `,
      output: dedent`
        export default {
          excludeStories: /.*Data$/,
        }

        export const mockData = {}

        export const Default = {}
      `,
      errors: [
        {
          messageId: 'shouldHaveStoryExport',
        },
      ],
    },
  ],
})
