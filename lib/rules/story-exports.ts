/**
 * @fileoverview A story file must contain at least one story export
 * @author Yann Braga
 */

import type { Program } from '@typescript-eslint/types/dist/ast-spec'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  getAllNamedExports,
  getDescriptor,
  getMetaObjectExpression,
  isValidStoryExport,
} from '../utils'
import { isImportDeclaration } from '../utils/ast'
import { IncludeExcludeOptions } from '@storybook/csf'
import { ObjectExpression, Identifier } from '@typescript-eslint/types/dist/ast-spec'

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
    fixable: undefined, // change to 'code' once we have autofixes
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
    let nonStoryExportsConfig: IncludeExcludeOptions = {}
    let meta: ObjectExpression | null
    let namedExports: Identifier[] = []

    return {
      ImportSpecifier(node) {
        if (node.imported.name === 'storiesOf') {
          hasStoriesOfImport = true
        }
      },
      ExportDefaultDeclaration: function (node) {
        meta = getMetaObjectExpression(node, context)
        if (meta) {
          try {
            nonStoryExportsConfig = {
              excludeStories: getDescriptor(meta, 'excludeStories'),
              includeStories: getDescriptor(meta, 'includeStories'),
            }
          } catch (err) {}
        }
      },
      ExportNamedDeclaration: function (node) {
        namedExports.push(...getAllNamedExports(node))
      },
      'Program:exit': function (program: Program) {
        if (hasStoriesOfImport || !meta) {
          return
        }

        const storyExports = namedExports.filter((exp) =>
          isValidStoryExport(exp, nonStoryExportsConfig)
        )

        if (storyExports.length) {
          return
        }

        const firstNonImportStatement = program.body.find((n) => !isImportDeclaration(n))
        const node = firstNonImportStatement || program.body[0] || program

        // @TODO: bring apply this autofix with CSF3 release
        // const fix = (fixer) => fixer.insertTextAfter(node, `\n\nexport const Default = {}`)

        const report = {
          node,
          messageId: 'shouldHaveStoryExport',
          // fix,
        } as const

        context.report(report)
      },
    }
  },
})
