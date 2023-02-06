/**
 * @fileoverview Storybook's main config should use a default export format
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/use-default-export-in-main'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('use-export-default-in-main', rule, {
  valid: [
    `
    export default {
      addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/preset-create-react-app"
      ]
    }
  `,
  ],
  invalid: [
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          '@storybook/not-installed-addon'
        ]
      }
      `,
      errors: [
        {
          messageId: 'shouldUseDefaultExport',
        },
      ],
    },
    {
      code: `
      export const addons = [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        '@storybook/not-installed-addon'
      ]
      `,
      errors: [
        {
          messageId: 'shouldUseDefaultExport',
        },
      ],
    },
  ],
})
