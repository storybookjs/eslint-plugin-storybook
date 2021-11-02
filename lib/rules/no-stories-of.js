/**
 * @fileoverview storiesOf is deprecated and should not be used
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
      description: 'storiesOf is deprecated and should not be used',
      category: CATEGORY_ID.CSF_STRICT,
      recommended: false,
      recommendedConfig: 'error',
      url: docsUrl('no-stories-of'), // URL to the documentation page for this rule
    },
    messages: {
      description: 'storiesOf is deprecated and should not be used',
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

    return {
      ImportSpecifier(node) {
        if (node.imported.name === 'storiesOf') {
          context.report({
            node,
            messageId: 'description',
          })
        }
      },
    }
  },
}
