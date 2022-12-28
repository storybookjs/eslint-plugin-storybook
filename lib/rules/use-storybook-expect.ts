/**
 * @fileoverview Use expect from '@storybook/jest'
 * @author Yann Braga
 */

import { CategoryId } from '../utils/constants'
import { isIdentifier, isImportSpecifier } from '../utils/ast'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { TSESTree } from '@typescript-eslint/utils'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

type TDefaultOptions = {
  storybookJestPath?: string
}[]

export = createStorybookRule<TDefaultOptions, string>({
  name: 'use-storybook-expect',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    docs: {
      description: 'Use expect from `@storybook/jest`',
      categories: [CategoryId.ADDON_INTERACTIONS, CategoryId.RECOMMENDED],
      recommended: 'error',
    },
    messages: {
      updateImports: 'Update imports',
      useExpectFromStorybook:
        'Do not use expect from jest directly in the story. You should use from `@storybook/jest` instead.',
    },
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isExpectFromStorybookImported = (node: TSESTree.ImportDeclaration) => {
      return (
        node.source.value === '@storybook/jest' &&
        node.specifiers.find((spec) => isImportSpecifier(spec) && spec.imported.name === 'expect')
      )
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let isImportingFromStorybookExpect = false
    const expectInvocations: TSESTree.Identifier[] = []

    return {
      ImportDeclaration(node) {
        if (isExpectFromStorybookImported(node)) {
          isImportingFromStorybookExpect = true
        }
      },
      CallExpression(node) {
        if (!isIdentifier(node.callee)) {
          return null
        }

        if (node.callee.name === 'expect') {
          expectInvocations.push(node.callee)
        }
      },
      'Program:exit': function () {
        if (!isImportingFromStorybookExpect && expectInvocations.length) {
          expectInvocations.forEach((node) => {
            context.report({
              node,
              messageId: 'useExpectFromStorybook',
              fix: function (fixer) {
                return fixer.insertTextAfterRange(
                  [0, 0],
                  "import { expect } from '@storybook/jest';\n"
                )
              },
              suggest: [
                {
                  messageId: 'updateImports',
                  fix: function (fixer) {
                    return fixer.insertTextAfterRange(
                      [0, 0],
                      "import { expect } from '@storybook/jest';\n"
                    )
                  },
                },
              ],
            })
          })
        }
      },
    }
  },
})
