/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */

import { docsUrl } from '../utils'

import { CATEGORY_ID } from '../utils/constants'

import type { RuleModule } from '../types'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Story files should have a default export',
      category: CATEGORY_ID.CSF,
      recommended: true,
      recommendedConfig: 'error',
      url: docsUrl('default-exports'), // URL to the documentation page for this rule
    },
    messages: {
      shouldHaveDefaultExport: 'The file should have a default export.',
    },
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let hasDefaultExport = false

    return {
      ExportDefaultSpecifier: function () {
        hasDefaultExport = true
      },
      ExportDefaultDeclaration: function () {
        hasDefaultExport = true
      },
      'Program:exit': function (node: any) {
        if (!hasDefaultExport) {
          context.report({
            node,
            loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } },
            messageId: 'shouldHaveDefaultExport',
          })
        }
      },
    }
  },
}

export default rule
