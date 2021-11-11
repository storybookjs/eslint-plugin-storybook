/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

import { findVariable } from '@typescript-eslint/experimental-utils/dist/ast-utils'
import { ExportNamedDeclaration } from '@typescript-eslint/types/dist/ast-spec'
import { isExportStory } from '@storybook/csf'

import { getDescriptor, getMetaObjectExpression } from '../utils'
import { isIdentifier, isVariableDeclaration } from '../utils/ast'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'prefer-pascal-case',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    fixable: 'code', // Or `code` or `whitespace`
    docs: {
      description: 'Stories should use PascalCase',
      categories: [CategoryId.RECOMMENDED],
      recommended: 'warn',
    },
    messages: {
      convertToPascalCase: 'Use pascal case',
      usePascalCase: 'The story should use PascalCase notation: {{name}}',
    },
    schema: [],
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isPascalCase = (str: any) => /^[A-Z]+([a-z0-9]?)+/.test(str)
    const toPascalCase = (str: any) => {
      return (
        str
          //@ts-ignore
          .replace(new RegExp(/[-_]+/, 'g'), ' ')
          //@ts-ignore
          .replace(new RegExp(/[^\w\s]/, 'g'), '')
          .replace(
            //@ts-ignore
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1: any, $2: any, $3: any) => `${$2.toUpperCase() + $3.toLowerCase()}`
          )
          //@ts-ignore
          .replace(new RegExp(/\s/, 'g'), '')
          .replace(new RegExp(/\w/), (s: any) => s.toUpperCase())
      )
    }

    const checkAndReportError = (id, nonStoryExportsConfig = {}) => {
      const { name } = id
      if (!isExportStory(name, nonStoryExportsConfig) || name === '__namedExportsOrder') {
        return null
      }

      if (!name.startsWith('_') && !isPascalCase(name)) {
        context.report({
          node: id,
          messageId: 'usePascalCase',
          data: {
            name,
          },
          suggest: [
            {
              messageId: 'convertToPascalCase',
              *fix(fixer: any) {
                const fullText = context.getSourceCode().text
                const fullName = fullText.slice(id.range[0], id.range[1])
                const suffix = fullName.substring(name.length)
                const pascal = toPascalCase(name)
                yield fixer.replaceTextRange(id.range, pascal + suffix)

                const scope = context.getScope().childScopes[0]
                if (scope) {
                  const variable = findVariable(scope, name)
                  for (let i = 0; i < variable?.references?.length; i++) {
                    const ref = variable.references[i]
                    if (!ref.init) {
                      yield fixer.replaceTextRange(ref.identifier.range, pascal)
                    }
                  }
                }
              },
            },
          ],
        })
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    let meta
    let nonStoryExportsConfig
    let namedExports = []

    return {
      ExportDefaultDeclaration: function (node: any) {
        meta = getMetaObjectExpression(node, context)
        if (meta) {
          nonStoryExportsConfig = {
            excludeStories: getDescriptor(meta, 'excludeStories'),
            includeStories: getDescriptor(meta, 'includeStories'),
          }
        }
      },
      ExportNamedDeclaration: function (node: ExportNamedDeclaration) {
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
      'Program:exit': function () {
        if (namedExports.length) {
          namedExports.forEach((n) => checkAndReportError(n, nonStoryExportsConfig))
        }
      },
    }
  },
})
