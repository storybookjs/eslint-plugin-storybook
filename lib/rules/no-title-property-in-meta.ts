/**
 * @fileoverview No title property in meta
 * @author Yann Braga
 */

import { getMetaObjectExpression } from '../utils'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'no-title-property-in-meta',
  defaultOptions: [],
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      // @TODO check about this, as this only works in Typescript if the title property is optional, likely part of 6.4 typings
      description: 'Do not define a title in meta',
      categories: [CategoryId.CSF_STRICT],
      recommended: 'error',
    },
    messages: {
      removeTitleInMeta: 'Do not define a title in meta',
      noTitleInMeta: `CSF3 does not need a title in meta`,
    },
    schema: [],
  },
  create: function (context: any) {
    return {
      ExportDefaultDeclaration: function (node: any) {
        const meta = getMetaObjectExpression(node, context)
        if (!meta) {
          return null
        }

        const titleNode = meta.properties.find((prop: any) => prop.key.name === 'title')

        if (titleNode) {
          context.report({
            node,
            messageId: 'noTitleInMeta',
            // In case we want this to be auto fixed by --fix
            // fix: function (fixer) {
            //   return fixer.remove(
            //     titleNode
            //   )
            // },
            suggest: [
              {
                messageId: 'removeTitleInMeta',
                fix: function (fixer: any) {
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
})
