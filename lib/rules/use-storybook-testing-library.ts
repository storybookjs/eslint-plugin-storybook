/**
 * @fileoverview Do not use testing library directly on stories
 * @author Yann Braga
 */
'use strict'

const { docsUrl } = require('../utils')
const { isImportDefaultSpecifier } = require('../utils/ast')
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

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const getRangeWithoutQuotes = (source) => {
      return [
        // Not sure how to improve this. If I use node.source.range
        // it will eat the quotes and we do not want to specify whether the quotes are single or double
        source.range[0] + 1,
        source.range[1] - 1,
      ]
    }

    const hasDefaultImport = (specifiers) => specifiers.find((s) => isImportDefaultSpecifier(s))

    const getSpecifiers = (node) => {
      const { specifiers } = node

      const start = specifiers[0].range[0]
      let end = specifiers[specifiers.length - 1].range[1]

      // this weird hack is necessary because the specifier range
      // does not include the closing brace:
      //
      // import foo, { bar } from 'baz';
      //        ^        ^ end
      const fullText = context.getSourceCode().text
      const importEnd = node.range[1]
      const closingBrace = fullText.indexOf('}', end - 1)
      if (closingBrace > -1 && closingBrace <= importEnd) {
        end = closingBrace + 1
      }
      const text = fullText.substring(start, end)

      return { range: [start, end], text }
    }

    const fixSpecifiers = (specifiersText) => {
      const flattened = specifiersText
        .replace('{', '')
        .replace('}', '')
        .replace(/\s\s+/g, ' ')
        .trim()
      return `{ ${flattened} }`
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node: any) {
        if (node.source.value.includes('@testing-library')) {
          context.report({
            node,
            messageId: 'dontUseTestingLibraryDirectly',
            data: {
              library: node.source.value,
            },
            *fix(fixer) {
              yield fixer.replaceTextRange(
                getRangeWithoutQuotes(node.source),
                '@storybook/testing-library'
              )
              if (hasDefaultImport(node.specifiers)) {
                const { range, text } = getSpecifiers(node)
                yield fixer.replaceTextRange(range, fixSpecifiers(text))
              }
            },
            suggest: [
              {
                messageId: 'updateImports',
                *fix(fixer) {
                  yield fixer.replaceTextRange(
                    getRangeWithoutQuotes(node.source),
                    '@storybook/testing-library'
                  )
                  if (hasDefaultImport(node.specifiers)) {
                    const { range, text } = getSpecifiers(node)
                    yield fixer.replaceTextRange(range, fixSpecifiers(text))
                  }
                },
              },
            ],
          })
        }
      },
    }
  },
}
