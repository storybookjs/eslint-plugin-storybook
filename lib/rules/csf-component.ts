/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */

import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'csf-component',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'The component property should be set',
      categories: [CategoryId.CSF],
      recommended: 'warn',
    },
    messages: {
      missingComponentProperty: 'Missing component property.',
    },
    schema: [],
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportDefaultDeclaration: function (node: any) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties =
          node.declaration.properties ||
          (node.declaration.expression && node.declaration.expression.properties)

        if (!metaProperties) {
          return
        }

        const component = metaProperties.find((prop: any) => prop.key.name === 'component')

        if (!component) {
          context.report({
            node,
            messageId: 'missingComponentProperty',
          })
        }
      },
    }
  },
})
