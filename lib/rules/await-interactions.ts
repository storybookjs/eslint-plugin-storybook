/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */

import { docsUrl, isPlayFunction } from '../utils'
import { CATEGORY_ID } from '../utils/constants'
import {
  isCallExpression,
  isMemberExpression,
  isIdentifier,
  isExpressionStatement,
  isVariableDeclaration,
  isVariableDeclarator,
  isAwaitExpression,
} from '../utils/ast'
import type { RuleModule } from '../types'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: RuleModule = {
  meta: {
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

    const getNonAwaitedCallExpressions = (body = []) => {
      return (
        body
          .filter((b) => {
            //@ts-ignore
            return isExpressionStatement(b) && isCallExpression(b.expression)
          })
          //@ts-ignore
          .map((d) => d.expression)
      )
    }

    const getNonAwaitedInitializations = (body = []) => {
      const initializations = body
        //@ts-ignore
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

    //@ts-ignore
    const getMethodThatShouldBeAwaited = (expression) => {
      const shouldAwait = (name: any) => {
        //@ts-ignore
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
          //@ts-ignore
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

export default rule
