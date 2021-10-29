/**
 * @fileoverview Do not testing library directly on stories
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-storybook-testing-library'),
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('use-storybook-testing-library', rule, {
  valid: ["import { within } from '@storybook/testing-library'"],
  invalid: [
    {
      code: `import { within } from '@testing-library/react'`,
      errors: [
        {
          message:
            'Do not use `@testing-library/react` directly in the story. You should import the functions from `@storybook/testing-library` instead.',
          type: 'ImportDeclaration',
          suggestions: [{ output: "import { within } from '@storybook/testing-library'" }],
        },
      ],
    },
  ],
})
