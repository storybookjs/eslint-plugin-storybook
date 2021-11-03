/**
 * @fileoverview Use expect from '@storybook/expect'
 * @author Yann Braga
 */

import { docsUrl, isPlayFunction } from '../utils'

import { CATEGORY_ID } from '../utils/constants'
import {
  isExpressionStatement,
  isCallExpression,
  isMemberExpression,
  isIdentifier,
} from '../utils/ast'

import type { RuleModule } from '../types'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code', // Or `code` or `whitespace`,
    hasSuggestions: true,
    docs: {
      description: 'Use expect from `@storybook/jest`',
      category: CATEGORY_ID.ADDON_INTERACTIONS,
      recommended: true,
      recommendedConfig: 'error',
      url: docsUrl('use-storybook-expect'), // URL to the documentation page for this rule
    },
    messages: {
      updateImports: 'Update imports',
      useExpectFromStorybook:
        'Do not use expect from jest directly in the story. You should use from `@storybook/jest` instead.',
    },
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const getExpressionStatements = (body = []) => {
      return body.filter((b) => isExpressionStatement(b))
    }

    //@ts-ignore
    const isExpect = (expression) => {
      return (
        isCallExpression(expression) &&
        isMemberExpression(expression.callee) &&
        isCallExpression(expression.callee.object) &&
        isIdentifier(expression.callee.object.callee) &&
        expression.callee.object.callee.name === 'expect'
      )
    }

    const isExpectFromStorybookImported = (node: any) => {
      return (
        node.source.value === '@storybook/jest' &&
        node.specifiers.find((spec: any) => spec.imported.name === 'expect')
      )
    }
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let isImportingFromStorybookExpect = false
    let expectInvocations: any = []

    return {
      ImportDeclaration(node: any) {
        if (isExpectFromStorybookImported(node)) {
          isImportingFromStorybookExpect = true
        }
      },
      AssignmentExpression(node: any) {
        if (!isExpressionStatement(node.parent)) {
          return null
        }

        if (isPlayFunction(node)) {
          const { right } = node
          const expressionBody = (right.body && right.body.body) || []
          const expressionStatements = getExpressionStatements(expressionBody)
          expressionStatements.forEach(({ expression }) => {
            if (isExpect(expression)) {
              expectInvocations.push(expression)
            }
          })
        }
      },
      'Program:exit': function () {
        if (!isImportingFromStorybookExpect && expectInvocations.length) {
          //@ts-ignore
          expectInvocations.forEach((node) => {
            context.report({
              node,
              messageId: 'useExpectFromStorybook',
              fix: function (fixer: any) {
                return fixer.insertTextAfterRange(
                  [0, 0],
                  "import { expect } from '@storybook/jest';\n"
                )
              },
              suggest: [
                {
                  messageId: 'updateImports',
                  fix: function (fixer: any) {
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
}

export default rule
