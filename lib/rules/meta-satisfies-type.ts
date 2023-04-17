/**
 * @fileoverview Meta should be followed by `satisfies Meta`
 * @author Tiger Oakes
 */

import { TSESTree } from '@typescript-eslint/utils'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import { isIdentifier, isVariableDeclaration } from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'meta-satisfies-type',
  defaultOptions: [],
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Fill me in',
      // Add the categories that suit this rule.
      categories: [CategoryId.RECOMMENDED],
      recommended: 'warn', // `warn` or `error`
    },
    messages: {
      anyMessageIdHere: 'Fill me in',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [], // Add a schema if the rule has options. Otherwise remove this
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      /**
       * 👉 Please read this and then delete this entire comment block.
       * This is an example rule that reports an error in case a named export is called 'wrong'.
       * Hopefully this will guide you to write your own rules. Make sure to always use the AST utilities and account for all possible cases.
       *
       * Keep in mind that sometimes AST nodes change when in javascript or typescript format. For example, the type of "declaration" from "export default {}" is ObjectExpression but in "export default {} as SomeType" is TSAsExpression.
       *
       * Use https://eslint.org/docs/developer-guide/working-with-rules for Eslint API reference
       * And check https://astexplorer.net/ to help write rules
       * Working with AST is fun. Good luck!
       */
      ExportNamedDeclaration: function (node: TSESTree.ExportNamedDeclaration) {
        const declaration = node.declaration
        if (!declaration) return
        // use AST helpers to make sure the nodes are of the right type
        if (isVariableDeclaration(declaration)) {
          const identifier = declaration.declarations[0]?.id
          if (isIdentifier(identifier)) {
            const { name } = identifier
            if (name === 'wrong') {
              context.report({
                node,
                messageId: 'anyMessageIdHere',
              })
            }
          }
        }
      },
    }
  },
})