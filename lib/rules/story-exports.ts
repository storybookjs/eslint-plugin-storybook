/**
 * @fileoverview A story file must contain at least one story export
 * @author Yann Braga
 */

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  getAllNamedExports,
  getDescriptor,
  getMetaObjectExpression,
  isValidStoryExport,
} from '../utils'

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
    fixable: null, // change to 'code' once we have autofixes
    schema: [],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

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
        namedExports.push(...getAllNamedExports(node))
      },
      'Program:exit': function (node) {
        if (hasStoriesOfImport || !meta) {
          return
        }

        const storyExports = namedExports.filter((exp) =>
          isValidStoryExport(exp, nonStoryExportsConfig)
        )

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
