/**
 * @fileoverview A story file must contain at least one story export
 * @author Yann Braga
 */

import { isExportStory } from '@storybook/csf'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import { getDescriptor, getMetaObjectExpression } from '../utils'
import { isIdentifier, isVariableDeclaration } from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'story-exports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'A story file must contain at least one story export',
      categories: [CategoryId.RECOMMENDED, CategoryId.CSF],
      recommended: 'error',
    },
    messages: {
      shouldHaveStoryExport: 'The file should have at least one story export',
      addStoryExport: 'Add a story export',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isValidStoryExport = (node) =>
      isExportStory(node.name, nonStoryExportsConfig) && node.name !== '__namedExportsOrder'

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let hasStoriesOfImport = false
    let nonStoryExportsConfig = {}
    let meta
    let namedExports = []

    return {
      ImportSpecifier(node) {
        if (node.imported.name === 'storiesOf') {
          hasStoriesOfImport = true
        }
      },
      ExportDefaultDeclaration: function (node) {
        meta = getMetaObjectExpression(node, context)
        if (meta) {
          nonStoryExportsConfig = {
            excludeStories: getDescriptor(meta, 'excludeStories'),
            includeStories: getDescriptor(meta, 'includeStories'),
          }
        }
      },
      ExportNamedDeclaration: function (node) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) return

        const decl = node.declaration
        if (isVariableDeclaration(decl)) {
          const { id } = decl.declarations[0]
          if (isIdentifier(id)) {
            namedExports.push(id)
          }
        }
      },
      'Program:exit': function (node) {
        if (hasStoriesOfImport || !meta) {
          return
        }

        const storyExports = namedExports.filter(isValidStoryExport)

        if (storyExports.length) {
          return
        }

        // @TODO: bring apply this autofix with CSF3 release
        // const fix = (fixer) => fixer.insertTextAfter(node, `\n\nexport const Default = {}`)

        context.report({
          node,
          messageId: 'shouldHaveStoryExport',
          // fix,
        })
      },
    }
  },
})
