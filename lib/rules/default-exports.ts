/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default createStorybookRule({
  name: '',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Story files should have a default export',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
      recommended: 'error',
    },
    messages: {
      shouldHaveDefaultExport: 'The file should have a default export.',
    },
    schema: [],
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
})
