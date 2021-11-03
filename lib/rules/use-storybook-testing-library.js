/**
 * @fileoverview Do not use testing library directly on stories
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
    type: 'suggestion',
    fixable: 'code', // Or `code` or `whitespace`
    hasSuggestions: true,
    docs: {
      description: 'Do not use testing-library directly on stories',
      category: CATEGORY_ID.ADDON_INTERACTIONS,
      recommended: true,
      recommendedConfig: 'error',
      url: docsUrl('use-storybook-testing-library'), // URL to the documentation page for this rule
    },
    messages: {
      updateImports: 'Update imports',
      dontUseTestingLibraryDirectly:
        'Do not use `{{library}}` directly in the story. You should import the functions from `@storybook/testing-library` instead.',
    },
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const getRangeWithoutQuotes = (node) => {
      return [
        // Not sure how to improve this. If I use node.source.range
        // it will eat the quotes and we do not want to specify whether the quotes are single or double
        node.source.range[0] + 1,
        node.source.range[1] - 1,
      ]
    }
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        if (node.source.value.includes('@testing-library')) {
          context.report({
            node,
            messageId: 'dontUseTestingLibraryDirectly',
            data: {
              library: node.source.value,
            },
            fix: function (fixer) {
              return fixer.replaceTextRange(
                getRangeWithoutQuotes(node),
                '@storybook/testing-library'
              )
            },
            suggest: [
              {
                messageId: 'updateImports',
                fix: function (fixer) {
                  return fixer.replaceTextRange(
                    getRangeWithoutQuotes(node),
                    '@storybook/testing-library'
                  )
                },
              },
            ],
          })
        }
      },
    }
  },
}
