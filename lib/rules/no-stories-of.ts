/**
 * @fileoverview storiesOf is deprecated and should not be used
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
    }
  },
}

export default rule
