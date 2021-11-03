/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */

import { docsUrl } from '../utils'

import { CATEGORY_ID } from '../utils/constants'

import type { RuleModule } from '../types'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'The component property should be set',
      category: CATEGORY_ID.CSF,
      recommended: false,
      recommendedConfig: 'warn',
      url: docsUrl('csf-component'), // URL to the documentation page for this rule
    },
    messages: {
      missingComponentProperty: 'Missing component property.',
    },
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
}

export default rule
