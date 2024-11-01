/**
 * @fileoverview Story files should have a default export
 * @author Yann Braga
 */

import path from 'path'
import { TSESLint, TSESTree } from '@typescript-eslint/utils'

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
    severity: 'error',
    docs: {
      description: 'Story files should have a default export',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
    },
    messages: {
      shouldHaveDefaultExport: 'The file should have a default export.',
      fixSuggestion: 'Add default export',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const getComponentName = (node: TSESTree.Program, filePath: string) => {
      const name = path.basename(filePath).split('.')[0]
      const imported = node.body.find((stmt: TSESTree.Node) => {
        if (
          isImportDeclaration(stmt) &&
          isLiteral(stmt.source) &&
          stmt.source.value.startsWith(`./${name}`)
        ) {
          return !!stmt.specifiers.find(
            (spec) => isIdentifier(spec.local) && spec.local.name === name
          )
        }
      })
      return imported ? name : null
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let hasDefaultExport = false
    let localMetaNode: TSESTree.Node
    let hasStoriesOfImport = false

    return {
      ImportSpecifier(node) {
        if (node.imported.name === 'storiesOf') {
          hasStoriesOfImport = true
        }
      },
      VariableDeclaration(node) {
        // Take `const meta = {};` into consideration
        if (
          node.kind === 'const' &&
          node.declarations.length === 1 &&
          node.declarations[0]?.id.type === 'Identifier' &&
          node.declarations[0]?.id.name === 'meta'
        ) {
          localMetaNode = node
        }
      },
      ExportDefaultSpecifier: function () {
        hasDefaultExport = true
      },
      ExportDefaultDeclaration: function () {
        hasDefaultExport = true
      },
      'Program:exit': function (program: TSESTree.Program) {
        if (!hasDefaultExport && !hasStoriesOfImport) {
          const componentName = getComponentName(program, context.filename)
          const firstNonImportStatement = program.body.find((n) => !isImportDeclaration(n))
          const node = firstNonImportStatement ?? program.body[0] ?? program

          const report = {
            node,
            messageId: 'shouldHaveDefaultExport',
          } as const

          const fix: TSESLint.ReportFixFunction = (fixer) => {
            const sourceCode = context.sourceCode.getText()
            // only add semicolons if needed
            const semiCharacter = sourceCode.includes(';') ? ';' : ''
            if (localMetaNode) {
              const exportStatement = `\nexport default meta${semiCharacter}`
              return fixer.insertTextAfter(localMetaNode, exportStatement)
            } else {
              const exportStatement = componentName
                ? `export default { component: ${componentName} }${semiCharacter}\n`
                : `export default {}${semiCharacter}\n`
              return fixer.insertTextBefore(node, exportStatement)
            }
          }

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
      },
    }
  },
})
