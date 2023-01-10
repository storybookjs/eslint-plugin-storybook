/**
 * @fileoverview Pass a context object when invoking a play function
 * @author Yann Braga
 */

import { TSESTree } from '@typescript-eslint/utils'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isMemberExpression,
  isIdentifier,
  isTSNonNullExpression,
  isObjectExpression,
  isSpreadElement,
} from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'context-in-play-function',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Pass a context when invoking play function of another story',
      categories: [CategoryId.RECOMMENDED, CategoryId.ADDON_INTERACTIONS],
      recommended: 'error',
    },
    messages: {
      passContextToPlayFunction: 'Pass a context when invoking play function of another story',
    },
    fixable: undefined,
    schema: [],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    const isPlayFunctionFromAnotherStory = (expr: TSESTree.CallExpression) => {
      if (
        isTSNonNullExpression(expr.callee) &&
        isMemberExpression(expr.callee.expression) &&
        isIdentifier(expr.callee.expression.property) &&
        expr.callee.expression.property.name === 'play'
      ) {
        return true
      }

      if (
        isMemberExpression(expr.callee) &&
        isIdentifier(expr.callee.property) &&
        expr.callee.property.name === 'play'
      ) {
        return true
      }

      return false
    }

    // Expression passing an argument called context OR spreading a variable called context
    const isNotPassingContextCorrectly = (expr: TSESTree.CallExpression) => {
      const firstExpressionArgument = expr.arguments[0]

      if (!firstExpressionArgument) {
        return true
      }

      if (
        expr.arguments.length === 1 &&
        isIdentifier(firstExpressionArgument) &&
        firstExpressionArgument.name === 'context'
      ) {
        return false
      }

      if (
        isObjectExpression(firstExpressionArgument) &&
        firstExpressionArgument.properties.some((prop) => {
          return (
            isSpreadElement(prop) && isIdentifier(prop.argument) && prop.argument.name === 'context'
          )
        })
      ) {
        return false
      }

      return true
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const invocationsWithoutProperContext: TSESTree.Node[] = []

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (isPlayFunctionFromAnotherStory(node) && isNotPassingContextCorrectly(node)) {
          invocationsWithoutProperContext.push(node)
        }
      },
      'Program:exit': function () {
        invocationsWithoutProperContext.forEach((node) => {
          context.report({
            node,
            messageId: 'passContextToPlayFunction',
          })
        })
      },
    }
  },
})
