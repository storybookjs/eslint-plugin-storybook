/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */

import path from 'path'
import { Program, Node, ImportSpecifier } from '@typescript-eslint/types/dist/ast-spec'

import { CategoryId } from '../utils/constants'
import { isImportDeclaration, isLiteral, isIdentifier } from '../utils/ast'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'default-exports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Story files should have a default export',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
      recommended: 'error',
    },
    messages: {
      shouldHaveDefaultExport: 'The file should have a default export.',
      fixSuggestion: 'Add default export',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section
    const getComponentName = (node: Program, filePath: string) => {
      const name = path.basename(filePath).split('.')[0]
      const imported = node.body.find((stmt: Node) => {
        if (
          isImportDeclaration(stmt) &&
          isLiteral(stmt.source) &&
          stmt.source.value.startsWith(`./${name}`)
        ) {
          return !!stmt.specifiers.find(
            (spec: ImportSpecifier) => isIdentifier(spec.local) && spec.local.name === name
          )
        }
      })
      return imported ? name : null
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let hasDefaultExport = false
    let hasStoriesOfImport = false

    return {
      ImportSpecifier(node: any) {
        if (node.imported.name === 'storiesOf') {
          hasStoriesOfImport = true
        }
      },
      ExportDefaultSpecifier: function () {
        hasDefaultExport = true
      },
      ExportDefaultDeclaration: function () {
        hasDefaultExport = true
      },
      'Program:exit': function (program: Program) {
        if (!hasDefaultExport && !hasStoriesOfImport) {
          const componentName = getComponentName(program, context.getFilename())
          const firstNonImportStatement = program.body.find((n) => !isImportDeclaration(n))
          const node = firstNonImportStatement || program.body[0] || program
          const report = {
            node,
            messageId: 'shouldHaveDefaultExport',
          }

          if (!componentName) {
            context.report(report)
          } else {
            const fix = (fixer) =>
              fixer.insertTextBefore(node, `export default { component: ${componentName} }\n`)

            context.report({
              ...report,
              fix,
              suggest: [
                {
                  messageId: 'fixSuggestion',
                  fix,
                },
              ],
            })
          }
        }
      },
    }
  },
})
