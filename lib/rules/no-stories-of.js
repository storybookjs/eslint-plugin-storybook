/**
 * @fileoverview storiesOf is deprecated and should not be used
 * @author Yann Braga
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "storiesOf is deprecated and should not be used",
      category: "csf-strict",
      recommended: false,
      recommendedConfig: 'error',
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      description: 'storiesOf is deprecated and should not be used'
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
        if(node.imported.name === 'storiesOf') {
          context.report({
            node,
            messageId: 'description'
          })
        }
      }
    };
  },
};
