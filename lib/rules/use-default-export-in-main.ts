/**
 * @fileoverview Storybook's main config should use a default export format
 * @author Yann Braga
 */

import { TSESTree } from '@typescript-eslint/utils'
import { isImportDeclaration } from '../utils/ast'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'default-export-in-main',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Main config should use a default export format',
      categories: [CategoryId.CSF_STRICT],
      recommended: 'error',
      isMainConfigRule: true,
    },
    messages: {
      shouldUseDefaultExport: 'Your main config should use a default export format.',
    },
    schema: [],
  },

  create(context) {
    let hasDefaultExport = false
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportDefaultDeclaration: function () {
        hasDefaultExport = true
      },
      'Program:exit': function (program: TSESTree.Program) {
        const firstNonImportStatement = program.body.find((n) => !isImportDeclaration(n))
        const node = firstNonImportStatement || program.body[0] || program

        if (!hasDefaultExport) {
          context.report({
            node,
            messageId: 'shouldUseDefaultExport',
          })
        }
      },
    }
  },
})
