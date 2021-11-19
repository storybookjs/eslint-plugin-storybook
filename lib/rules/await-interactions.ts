/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */

import type { CallExpression, Identifier, Node } from '@typescript-eslint/types/dist/ast-spec'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isMemberExpression,
  isIdentifier,
  isAwaitExpression,
  isCallExpression,
  isArrowFunctionExpression,
  isReturnStatement,
  isTSNonNullExpression,
} from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'await-interactions',
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
    fixable: 'code',
    schema: [],
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    const FUNCTIONS_TO_BE_AWAITED = [
      'waitFor',
      'waitForElementToBeRemoved',
      'wait',
      'waitForElement',
      'waitForDomChange',
      'userEvent',
      'play',
    ]

    const getMethodThatShouldBeAwaited = (expr: CallExpression) => {
      const shouldAwait = (name: any) => {
        return FUNCTIONS_TO_BE_AWAITED.includes(name) || name.startsWith('findBy')
      }

      // When an expression is a return value it doesn't need to be awaited
      if (isArrowFunctionExpression(expr.parent) || isReturnStatement(expr.parent)) {
        return null
      }

      if (
        isMemberExpression(expr.callee) &&
        isIdentifier(expr.callee.object) &&
        shouldAwait(expr.callee.object.name)
      ) {
        return expr.callee.object
      }

      if (
        isTSNonNullExpression(expr.callee) &&
        isMemberExpression(expr.callee.expression) &&
        isIdentifier(expr.callee.expression.property) &&
        shouldAwait(expr.callee.expression.property.name)
      ) {
        return expr.callee.expression.property
      }

      if (
        isMemberExpression(expr.callee) &&
        isIdentifier(expr.callee.property) &&
        shouldAwait(expr.callee.property.name)
      ) {
        return expr.callee.property
      }

      if (
        isMemberExpression(expr.callee) &&
        isCallExpression(expr.callee.object) &&
        isIdentifier(expr.callee.object.callee) &&
        isIdentifier(expr.callee.property) &&
        expr.callee.object.callee.name === 'expect'
      ) {
        return expr.callee.property
      }

      if (isIdentifier(expr.callee) && shouldAwait(expr.callee.name)) {
        return expr.callee
      }

      return null
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    /**
     * @param {import('eslint').Rule.Node} node
     */

    let invocationsThatShouldBeAwaited = [] as Array<{ node: Node; method: Identifier }>

    return {
      CallExpression(node: CallExpression) {
        const method = getMethodThatShouldBeAwaited(node)
        if (method && !isAwaitExpression(node.parent)) {
          invocationsThatShouldBeAwaited.push({ node, method })
        }
      },
      'Program:exit': function () {
        if (invocationsThatShouldBeAwaited.length) {
          invocationsThatShouldBeAwaited.forEach(({ node, method }) => {
            context.report({
              node,
              messageId: 'interactionShouldBeAwaited',
              data: {
                method: method.name,
              },
              fix: function (fixer) {
                return fixer.insertTextBefore(node, 'await ')
              },
              suggest: [
                {
                  messageId: 'fixSuggestion',
                  fix: function (fixer) {
                    return fixer.insertTextBefore(node, 'await ')
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
