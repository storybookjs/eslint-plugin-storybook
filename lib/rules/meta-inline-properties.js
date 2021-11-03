/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */
'use strict'

const { docsUrl } = require('../utils')
const { CATEGORY_ID } = require('../utils/constants')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Meta should only have inline properties',
      category: CATEGORY_ID.CSF_STRICT,
      recommended: false,
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

  create(context) {
    // variables should be defined here

    // In case we need to get options defined in the rule schema
    // const options = context.options[0] || {}
    // const csfVersion = options.csfVersion

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const isInline = (node) => {
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
      ExportDefaultDeclaration(node) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties =
          node.declaration.properties ||
          (node.declaration.expression && node.declaration.expression.properties)

        if (!metaProperties) {
          return
        }

        const ruleProperties = ['title', 'args']
        let dynamicProperties = []

        const metaNodes = metaProperties.filter((prop) => ruleProperties.includes(prop.key.name))

        metaNodes.forEach((metaNode) => {
          if (!isInline(metaNode)) {
            dynamicProperties.push(metaNode)
          }
        })

        if (dynamicProperties.length > 0) {
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
    }
  },
}
