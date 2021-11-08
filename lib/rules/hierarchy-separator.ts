/**
 * @fileoverview Deprecated hierarchy separator
 * @author Yann Braga
 */

import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: '',
  defaultOptions: [],
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Deprecated hierachy separator in title property',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
      recommended: 'warn',
    },
    messages: {
      useCorrectSeparators: 'Use correct separators',
      deprecatedHierarchySeparator:
        'Deprecated hierachy separator in title property: {{metaTitle}}.',
    },
    schema: [],
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
})
