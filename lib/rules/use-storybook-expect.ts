/**
 * @fileoverview Use expect from '@storybook/expect'
 * @author Yann Braga
 */
'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'docsUrl'.
const { docsUrl, isPlayFunction } = require('../utils')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CATEGORY_I... Remove this comment to see the full error message
const { CATEGORY_ID } = require('../utils/constants')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isExpressi... Remove this comment to see the full error message
  isExpressionStatement,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isCallExpr... Remove this comment to see the full error message
  isCallExpression,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isMemberEx... Remove this comment to see the full error message
  isMemberExpression,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isIdentifi... Remove this comment to see the full error message
  isIdentifier,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../utils/ast')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
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

    const isExpect = (expression = {}) => {
      return (
        isCallExpression(expression) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isMemberExpression(expression.callee) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isCallExpression(expression.callee.object) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isIdentifier(expression.callee.object.callee) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        expression.callee.object.callee.name === 'expect'
      )
    }

    const isExpectFromStorybookImported = (node: any) => {
      return node.source.value === '@storybook/jest' &&
      node.specifiers.find((spec: any) => spec.imported.name === 'expect');
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
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
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
    };
  },
}
