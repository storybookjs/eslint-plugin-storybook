/**
 * @fileoverview No title property in meta
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
    fixable: 'code',
    docs: {
      // @TODO check about this, as this only works in Typescript if the title property is optional, likely part of 6.4 typings
      description: 'Do not define a title in meta',
      category: 'csf-strict',
      recommended: false,
      recommendedConfig: 'error',
      url: docsUrl('no-title-property-in-meta'), // URL to the documentation page for this rule
    },
    messages: {
      fixSuggestion: 'Do not define a title in meta',
      description: `CSF3 does not need a title in meta`,
    },
  },
  create: function (context) {
    return {
      ExportDefaultDeclaration: function (node) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties = node.declaration.properties || node.declaration.expression.properties

        if (!metaProperties) {
          return
        }

        const titleNode = metaProperties.find((prop) => prop.key.name === 'title')

        if (titleNode) {
          context.report({
            node,
            messageId: 'description',
            // In case we want this to be auto fixed by --fix
            // fix: function (fixer) {
            //   return fixer.remove(
            //     titleNode
            //   )
            // },
            suggest: [
              {
                messageId: 'fixSuggestion',
                fix: function (fixer) {
                  // @TODO this suggestion keeps the comma and might result in error:
                  // e.g. { title, args } becomes { , args }
                  return fixer.remove(titleNode)
                },
              },
            ],
          })
        }
      },
    }
  },
}
