/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */

import { isPlayFunction } from '../utils'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isCallExpression,
  isMemberExpression,
  isIdentifier,
  isExpressionStatement,
  isVariableDeclaration,
  isVariableDeclarator,
  isAwaitExpression,
} from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: '',
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Interactions should be awaited',
      categories: [CategoryId.ADDON_INTERACTIONS, CategoryId.RECOMMENDED],
      recommended: 'error', // or 'warn'
    },
    messages: {
      interactionShouldBeAwaited: 'Interaction should be awaited: {{method}}',
      fixSuggestion: 'Add `await` to method',
    },
    type: 'problem',
    schema: [],
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
})
