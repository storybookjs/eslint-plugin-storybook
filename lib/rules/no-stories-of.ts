/**
 * @fileoverview storiesOf is deprecated and should not be used
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
      description: 'storiesOf is deprecated and should not be used',
      category: CATEGORY_ID.CSF_STRICT,
      recommended: false,
      recommendedConfig: 'error',
      url: docsUrl('no-stories-of'), // URL to the documentation page for this rule
    },
    messages: {
      doNotUseStoriesOf: 'storiesOf is deprecated and should not be used',
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

    return {
      ImportSpecifier(node: any) {
        if (node.imported.name === 'storiesOf') {
          context.report({
            node,
            messageId: 'doNotUseStoriesOf',
          })
        }
      },
    };
  },
}
