/**
 * @fileoverview Component property should be set
 * @author Yann Braga
 */

import { ExportDefaultDeclaration, Node } from '@typescript-eslint/types/dist/ast-spec'
import { isObjectExpression } from '../utils/ast'
import { getMetaObjectExpression } from '../utils'
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
      ExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        const meta = getMetaObjectExpression(node, context)
        if (meta && isObjectExpression(meta)) {
          const componentProperty = meta.properties.find(
            (property: any) => property.key.name === 'component'
          )
          if (!componentProperty) {
            context.report({
              node,
              messageId: 'missingComponentProperty',
            })
          }
        }
      },
    }
  },
})
