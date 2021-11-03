/**
 * @fileoverview Deprecated hierarchy separator
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
              return fixer.replaceTextRange(titleNode.value.range, metaTitle.replace(/\||\./g, '/'));
            },
            suggest: [
              {
                messageId: 'useCorrectSeparators',
                fix: function (fixer: any) {
                  return fixer.replaceTextRange(
                    titleNode.value.range,
                    metaTitle.replace(/\||\./g, '/')
                  );
                },
              },
            ],
          })
        }
      },
    };
  },
}
