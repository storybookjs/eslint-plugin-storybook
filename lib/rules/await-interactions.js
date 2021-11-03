/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */
'use strict'

const { docsUrl, isPlayFunction } = require('../utils')
const { CATEGORY_ID } = require('../utils/constants')
const {
  isCallExpression,
  isMemberExpression,
  isIdentifier,
  isExpressionStatement,
  isVariableDeclaration,
  isVariableDeclarator,
  isAwaitExpression,
} = require('../utils/ast')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Interactions should be awaited',
      category: CATEGORY_ID.ADDON_INTERACTIONS,
      recommended: true,
      recommendedConfig: 'error', // or 'warn'
      url: docsUrl('await-interactions'), // URL to the documentation page for this rule
    },
    messages: {
      interactionShouldBeAwaited: 'Interaction should be awaited: {{method}}',
      fixSuggestion: 'Add `await` to method',
    },
    // fixable: 'code', // Or `code` or `whitespace`
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    const FUNCTIONS_TO_BE_AWAITED = [
      'expect',
      'waitFor',
      'waitForElementToBeRemoved',
      'wait',
      'waitForElement',
      'waitForDomChange',
      'userEvent',
    ]
    /**
     * @param {import('eslint').Rule.Node[]} body
     */
    const getNonAwaitedCallExpressions = (body = []) => {
      return body
        .filter((b) => {
          return isExpressionStatement(b) && isCallExpression(b.expression)
        })
        .map((d) => d.expression)
    }

    /**
     * @param {import('eslint').Rule.Node[]} body
     */
    const getNonAwaitedInitializations = (body = []) => {
      const initializations = body
        .flatMap((b) => {
          return (
            isVariableDeclaration(b) &&
            b.declarations
              .filter((d) => isVariableDeclarator(d) && !isAwaitExpression(d.init))
              .map((d) => d.init)
          )
        })
        .filter(Boolean)

      return initializations
    }

    const getMethodThatShouldBeAwaited = (expression = {}) => {
      const shouldAwait = (name) => {
        console.log('should I await..', name)
        return FUNCTIONS_TO_BE_AWAITED.includes(name) || name.startsWith('findBy')
      }
      if (
        isCallExpression(expression) &&
        isMemberExpression(expression.callee) &&
        isIdentifier(expression.callee.object) &&
        shouldAwait(expression.callee.object.name)
      ) {
        return expression.callee.object
      }

      if (
        isCallExpression(expression) &&
        isMemberExpression(expression.callee) &&
        isIdentifier(expression.callee.property) &&
        shouldAwait(expression.callee.property.name)
      ) {
        return expression.callee.property
      }

      return null
    }
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    /**
     * @param {import('eslint').Rule.Node} node
     */

    let invocationsThatShouldBeAwaited = []

    return {
      AssignmentExpression(node) {
        if (!isExpressionStatement(node.parent)) {
          return null
        }

        if (isPlayFunction(node)) {
          const { right } = node
          const expressionBody = (right.body && right.body.body) || []
          const callExpressions = [
            ...getNonAwaitedCallExpressions(expressionBody),
            ...getNonAwaitedInitializations(expressionBody),
          ]

          callExpressions.forEach((expression) => {
            const method = getMethodThatShouldBeAwaited(expression)
            if (method) {
              invocationsThatShouldBeAwaited.push(method)
            }
          })
        }
      },
      'Program:exit': function () {
        if (invocationsThatShouldBeAwaited.length) {
          invocationsThatShouldBeAwaited.forEach((node) => {
            context.report({
              node,
              messageId: 'interactionShouldBeAwaited',
              data: {
                method: node.name,
              },
              // @TODO: make this auto-fixable. Currently it's pretty dumb so something like this can happen:
              // canvas.findByText => canvas.await findByText
              // instead of the correct: await canvas.findByText
              // fix: function (fixer) {
              //   return fixer.insertTextBefore(node, 'await ')
              // },
              // suggest: [
              //   {
              //     messageId: 'fixSuggestion',
              //     fix: function (fixer) {
              //       return fixer.insertTextBefore(node, 'await ')
              //     },
              //   },
              // ],
            })
          })
        }
      },
    }
  },
}
