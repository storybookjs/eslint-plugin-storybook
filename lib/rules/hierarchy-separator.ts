/**
 * @fileoverview Deprecated hierarchy separator
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
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Deprecated hierachy separator in title property',
      category: CATEGORY_ID.CSF,
      recommended: true,
      recommendedConfig: 'warn',
      url: docsUrl('hierarchy-separator'), // URL to the documentation page for this rule
    },
    messages: {
      useCorrectSeparators: 'Use correct separators',
      deprecatedHierarchySeparator:
        'Deprecated hierachy separator in title property: {{metaTitle}}.',
    },
  },
  create: function (context: any) {
    return {
      ExportDefaultDeclaration: function (node: any) {
        // Typescript 'TSAsExpression' has properties under declaration.expression
        const metaProperties =
          node.declaration.properties ||
          (node.declaration.expression && node.declaration.expression.properties)

        if (!metaProperties) {
          return
        }

        const titleNode = metaProperties.find((prop: any) => prop.key.name === 'title')

        // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
        if (!titleNode || !titleNode.value.type === 'Literal') {
          return
        }

        const metaTitle = titleNode.value.raw || ''

        if (metaTitle.includes('|') || metaTitle.includes('.')) {
          context.report({
            node,
            messageId: 'deprecatedHierarchySeparator',
            data: { metaTitle },
            // In case we want this to be auto fixed by --fix
            fix: function (fixer: any) {
              return fixer.replaceTextRange(titleNode.value.range, metaTitle.replace(/\||\./g, '/'))
            },
            suggest: [
              {
                messageId: 'useCorrectSeparators',
                fix: function (fixer: any) {
                  return fixer.replaceTextRange(
                    titleNode.value.range,
                    metaTitle.replace(/\||\./g, '/')
                  )
                },
              },
            ],
          })
        }
      },
    }
  },
}

export default rule
