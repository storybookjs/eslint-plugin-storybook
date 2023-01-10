/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import rule from '../../../lib/rules/mdx'
import { mdxRuleTester, parser, parserOptions } from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

// @ts-ignore
mdxRuleTester.run('mdx', rule, {
  valid: [
    {
      code: '## Hello',
      filename: 'remark.mdx',
      parser,
      parserOptions,
    },
  ],

  invalid: [
    // {
    //   code: "import { Meta } from '@storybook/addon-docs/blocks'",
    //   errors: [
    //     {
    //       messageId: 'missingComponentProperty',
    //       type: AST_NODE_TYPES.ExportDefaultDeclaration,
    //     },
    //   ],
    // },
  ],
})
