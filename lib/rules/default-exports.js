/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */
'use strict'

const { docsUrl } = require('../utils')
const { CATEGORY_ID } = require('../utils/constants')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
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
      description: 'The file should have a default export.',
    },
  },

  create(context) {
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
      'Program:exit': function (node) {
        if (!hasDefaultExport) {
          context.report({
            node,
            loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } },
            messageId: 'description',
          })
        }
      },
    }
  },
}
