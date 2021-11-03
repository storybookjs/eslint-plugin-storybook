/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */
'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'docsUrl'.
const { docsUrl } = require('../utils')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CATEGORY_I... Remove this comment to see the full error message
const { CATEGORY_ID } = require('../utils/constants')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Meta should only have inline properties',
      category: CATEGORY_ID.CSF,
      recommended: true,
      excludeFromConfig: true,
      recommendedConfig: ['error', { csfVersion: 3 }],
      url: docsUrl('meta-inline-properties'), // URL to the documentation page for this rule
    },
    messages: {
      metaShouldHaveInlineProperties: 'Meta should only have inline properties: {{property}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          csfVersion: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: any) {
    // variables should be defined here

    // In case we need to get options defined in the rule schema
    // const options = context.options[0] || {}
    // const csfVersion = options.csfVersion

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const isInline = (node: any) => {
      return (
        node.value.type === 'ObjectExpression' ||
        node.value.type === 'Literal' ||
        node.value.type === 'ArrayExpression'
      )
    }
    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportDefaultDeclaration(node: any) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties =
          node.declaration.properties ||
          (node.declaration.expression && node.declaration.expression.properties)

        if (!metaProperties) {
          return
        }

        const ruleProperties = ['title', 'args']
        let dynamicProperties: any = []

        // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
        const metaNodes = metaProperties.filter((prop: any) => ruleProperties.includes(prop.key.name))

        metaNodes.forEach((metaNode: any) => {
          if (!isInline(metaNode)) {
            dynamicProperties.push(metaNode)
          }
        })

        if (dynamicProperties.length > 0) {
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'propertyNode' implicitly has an 'any' t... Remove this comment to see the full error message
          dynamicProperties.forEach((propertyNode) => {
            context.report({
              node: propertyNode,
              messageId: 'metaShouldHaveInlineProperties',
              data: {
                property: propertyNode.key.name,
              },
            })
          })
        }
      },
    };
  },
}
