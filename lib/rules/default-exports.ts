/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */
'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'docsUrl'.
const { docsUrl } = require('../utils')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CATEGORY_I... Remove this comment to see the full error message
const { CATEGORY_ID } = require('../utils/constants')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
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
    };
  },
}
