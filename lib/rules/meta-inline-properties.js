/**
 * @fileoverview Meta should have inline properties
 * @author Yann Braga
 */
'use strict'

const { docsUrl } = require('../utils')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Meta should only have inline properties',
      category: 'csf',
      recommended: true,
      recommendedConfig: ['error', { csfVersion: 3 }],
      url: docsUrl('meta-inline-properties'), // URL to the documentation page for this rule
    },
    messages: {
      description: 'Meta should only have inline properties: {{properties}}',
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

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportDefaultDeclaration(node) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties = node.declaration.properties || node.declaration.expression.properties
        if (!metaProperties) {
          return
        }

        const ruleProperties = ['title', 'args']
        let dynamicProperties = []

        const metaNodes = metaProperties.filter((prop) => ruleProperties.includes(prop.key.name))

        metaNodes.forEach((metaNode) => {
          const isDynamic =
            metaNode.shorthand ||
            metaNode.value.type === 'BinaryExpression' ||
            (metaNode.value.type === 'TemplateLiteral' && metaNode.value.expressions.length > 0)

          if (isDynamic) {
            dynamicProperties.push(metaNode.key.name)
          }
        })

        if (dynamicProperties.length > 0) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'description',
            data: {
              properties: dynamicProperties.join(', '),
            },
          })
        }
      },
    }
  },
}