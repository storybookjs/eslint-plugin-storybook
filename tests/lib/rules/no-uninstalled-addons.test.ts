/**
 * @fileoverview This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name.
 * @author Andre Santos
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils'

import rule from '../../../lib/rules/no-uninstalled-addons'
import ruleTester from '../../utils/rule-tester'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: (a: string, b: string) => `
    {
      "name": "react-repro",
      "version": "1.0.0",
      "main": "index.js",
      "license": "MIT",
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      "packageManager": "yarn@3.2.1",
      "devDependencies": {
        "@babel/core": "^7.18.5",
        "@mdx-js/react": "^1.6.22",
        "@storybook/addon-actions": "^6.5.9",
        "@storybook/addon-docs": "^6.5.9",
        "@storybook/addon-essentials": "^6.5.9",
        "@storybook/addon-interactions": "^6.5.9",
        "@storybook/addon-links": "^6.5.9",
        "@storybook/builder-webpack4": "^6.5.9",
        "@storybook/manager-webpack4": "^6.5.9",
        "@storybook/react": "^6.5.9",
        "@storybook/testing-library": "^0.0.13",
        "storybook-addon-valid-addon": "0.0.1",
        "addon-without-the-prefix": "^0.0.1",
        "babel-loader": "^8.2.5",
        "prop-types": "^15.8.1"
      }
    }
  `,
}))

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('no-uninstalled-addons', rule, {
  /**
   * This is an example test for a  rule that reports an error in case a named export is called 'wrong'
   * Use https://eslint.org/docs/developer-guide/working-with-rules for Eslint API
   * And delete this entire comment block
   */
  valid: [
    `
    export default {
      addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
      ]
    }
  `,
    `
    export const addons = [
      "@storybook/addon-links",
      "@storybook/addon-essentials",
      "@storybook/addon-interactions",
    ]
  `,
    `
    module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          "storybook-addon-valid-addon/register",
          "addon-without-the-prefix/preset",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "storybook-addon-valid-addon",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-without-the-prefix",
        ]
      }
  `,
    `
    module.exports = {
        addons: [
          {
            name: "@storybook/addon-links",
          },
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          {
            name: "addon-without-the-prefix",
          },
          {
            name: "storybook-addon-valid-addon/register",
          },
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
          messageId: 'addonIsNotInstalled', // comes from the rule file
          // type: AST_NODE_TYPES.AssignmentExpression,
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/not-installed-addon',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          {
            name: '@storybook/not-installed-addon'
          }
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/not-installed-addon',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          {
            name: "@storybook/addon-esentials",
          },
          "@storybook/addon-interactions",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/adon-essentials",
          "@storybook/addon-interactions",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/adon-essentials',
          },
        },
      ],
    },
    {
      code: `
      module.exports = {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-withut-the-prefix",
          "@storybook/addon-esentials",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: 'addon-withut-the-prefix',
          },
        },
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
          },
        },
      ],
    },
    {
      code: `
      export default {
        addons: [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-withut-the-prefix",
          "@storybook/addon-esentials",
        ]
      }
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: 'addon-withut-the-prefix',
          },
        },
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
          },
        },
      ],
    },
    {
      code: `
        export const addons = [
          "@storybook/addon-links",
          "@storybook/addon-essentials",
          "@storybook/addon-interactions",
          "addon-withut-the-prefix",
          "@storybook/addon-esentials",
        ]
      `,
      errors: [
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: 'addon-withut-the-prefix',
          },
        },
        {
          messageId: 'addonIsNotInstalled', // comes from the rule file
          type: AST_NODE_TYPES.Literal,
          data: {
            addonName: '@storybook/addon-esentials',
          },
        },
      ],
    },
  ],
})
