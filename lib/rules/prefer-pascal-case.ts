/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

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

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ExportNamedDeclaration: function (node: any) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) return

        const { type } = node.declaration

        if (
          type === 'TSTypeAliasDeclaration' ||
          type === 'TypeAlias' ||
          type === 'TSInterfaceDeclaration' ||
          type === 'InterfaceDeclaration'
        ) {
          return
        }
        const identifier = node.declaration.declarations[0].id
        if (identifier) {
          const { name } = identifier
          if (!isPascalCase(name)) {
            context.report({
              node: identifier,
              messageId: 'usePascalCase',
              data: { name },
              suggest: [
                {
                  messageId: 'convertToPascalCase',
                  fix: function (fixer: any) {
                    return fixer.replaceTextRange(identifier.range, toPascalCase(name))
                  },
                },
              ],
            })
          }
        }
      },
    }
  },
})
