/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */
'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'docsUrl'.
const { docsUrl, isPlayFunction } = require('../utils')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CATEGORY_I... Remove this comment to see the full error message
const { CATEGORY_ID } = require('../utils/constants')
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isCallExpr... Remove this comment to see the full error message
  isCallExpression,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isMemberEx... Remove this comment to see the full error message
  isMemberExpression,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isIdentifi... Remove this comment to see the full error message
  isIdentifier,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isExpressi... Remove this comment to see the full error message
  isExpressionStatement,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isVariable... Remove this comment to see the full error message
  isVariableDeclaration,
  isVariableDeclarator,
  isAwaitExpression,
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../utils/ast')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
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

  create(context: any) {
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
      return (
        body
          .filter((b) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'expression' does not exist on type 'neve... Remove this comment to see the full error message
            return isExpressionStatement(b) && isCallExpression(b.expression)
          })
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'expression' does not exist on type 'neve... Remove this comment to see the full error message
          .map((d) => d.expression)
      )
    }

    /**
     * @param {import('eslint').Rule.Node[]} body
     */
    const getNonAwaitedInitializations = (body = []) => {
      const initializations = body
        // @ts-expect-error ts-migrate(2550) FIXME: Property 'flatMap' does not exist on type 'never[]... Remove this comment to see the full error message
        .flatMap((b: any) => {
          return (
            isVariableDeclaration(b) &&
            b.declarations
              .filter((d: any) => isVariableDeclarator(d) && !isAwaitExpression(d.init))
              .map((d: any) => d.init)
          )
        })
        .filter(Boolean)

      return initializations
    }

    const getMethodThatShouldBeAwaited = (expression = {}) => {
      const shouldAwait = (name) => {
        return FUNCTIONS_TO_BE_AWAITED.includes(name) || name.startsWith('findBy')
      }
      if (
        isCallExpression(expression) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isMemberExpression(expression.callee) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isIdentifier(expression.callee.object) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        shouldAwait(expression.callee.object.name)
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        return expression.callee.object
      }

      if (
        isCallExpression(expression) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isMemberExpression(expression.callee) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        isIdentifier(expression.callee.property) &&
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
        shouldAwait(expression.callee.property.name)
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'callee' does not exist on type '{}'.
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

    let invocationsThatShouldBeAwaited: any = []

    return {
      AssignmentExpression(node: any) {
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
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
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
