/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */

import type { Expression, Identifier, Node } from '@typescript-eslint/types/dist/ast-spec'

import { isPlayFunction } from '../utils'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isCallExpression,
  isMemberExpression,
  isIdentifier,
  isProgram,
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
      'expect',
      'waitFor',
      'waitForElementToBeRemoved',
      'wait',
      'waitForElement',
      'waitForDomChange',
      'userEvent',
    ]

    const getMethodThatShouldBeAwaited = (expr: Expression) => {
      const shouldAwait = (name: any) => {
        return FUNCTIONS_TO_BE_AWAITED.includes(name) || name.startsWith('findBy')
      }
      if (
        isCallExpression(expr) &&
        isMemberExpression(expr.callee) &&
        isIdentifier(expr.callee.object) &&
        shouldAwait(expr.callee.object.name)
      ) {
        return expr.callee.object
      }

      if (
        isCallExpression(expr) &&
        isMemberExpression(expr.callee) &&
        isIdentifier(expr.callee.property) &&
        shouldAwait(expr.callee.property.name)
      ) {
        return expr.callee.property
      }

      return null
    }

    const isInPlayFunction = (node: Node) => {
      if (isProgram(node)) return false
      if (isPlayFunction(node)) return true
      return isInPlayFunction(node.parent)
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    /**
     * @param {import('eslint').Rule.Node} node
     */

    let invocationsThatShouldBeAwaited = [] as Array<{ node: Node; method: Identifier }>

    return {
      CallExpression(node: Expression) {
        const method = getMethodThatShouldBeAwaited(node)
        if (method && !isAwaitExpression(node.parent) && isInPlayFunction(node)) {
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
