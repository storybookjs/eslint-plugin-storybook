/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

import { ASTUtils, TSESTree } from '@typescript-eslint/utils'
import { IncludeExcludeOptions, isExportStory } from '@storybook/csf'

import { getDescriptor, getMetaObjectExpression } from '../utils'
import { isIdentifier, isVariableDeclaration } from '../utils/ast'
import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function testDigit(char: string) {
  const charCode = char.charCodeAt(0);
  return charCode >= 48 && charCode <= 57;
}

function testUpperCase(char: string) {
  const upperCase = char.toUpperCase();
  return char === upperCase && upperCase !== char.toLowerCase();
}

function testLowerCase(char: string) {
  const lowerCase = char.toLowerCase();
  return char === lowerCase && lowerCase !== char.toUpperCase();
}

function testPascalCase(name: string) {
  if (!testUpperCase(name.charAt(0))) {
    return false;
  }
  const anyNonAlphaNumeric = Array.prototype.some.call(
    name.slice(1),
    (char) => char.toLowerCase() === char.toUpperCase() && !testDigit(char)
  );
  if (anyNonAlphaNumeric) {
    return false;
  }
  return Array.prototype.some.call(
    name.slice(1),
    (char) => testLowerCase(char) || testDigit(char)
  );
}

export = createStorybookRule({
  name: 'prefer-pascal-case',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    fixable: 'code',
    hasSuggestions: true,
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

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isPascalCase = (str: string) => testPascalCase(str)
    const toPascalCase = (str: string) => {
      return str
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
          new RegExp(/\s+(.)(\w+)/, 'g'),
          (_, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), (s) => s.toUpperCase())
    }

    const checkAndReportError = (id: TSESTree.Identifier, nonStoryExportsConfig = {}) => {
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
              *fix(fixer) {
                const fullText = context.getSourceCode().text
                const fullName = fullText.slice(id.range[0], id.range[1])
                const suffix = fullName.substring(name.length)
                const pascal = toPascalCase(name)
                yield fixer.replaceTextRange(id.range, pascal + suffix)

                const scope = context.getScope().childScopes[0]
                if (scope) {
                  const variable = ASTUtils.findVariable(scope, name)
                  const referenceCount = variable?.references?.length || 0

                  for (let i = 0; i < referenceCount; i++) {
                    const ref = variable?.references[i]
                    if (ref && !ref.init) {
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
    let nonStoryExportsConfig: IncludeExcludeOptions
    const namedExports: TSESTree.Identifier[] = []
    let hasStoriesOfImport = false

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
          } catch (err) {
            //
          }
        }
      },
      ExportNamedDeclaration: function (node: TSESTree.ExportNamedDeclaration) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) return

        const decl = node.declaration
        if (isVariableDeclaration(decl)) {
          const declaration = decl.declarations[0]
          if (declaration == null) return
          const { id } = declaration
          if (isIdentifier(id)) {
            namedExports.push(id)
          }
        }
      },
      'Program:exit': function () {
        if (namedExports.length && !hasStoriesOfImport) {
          namedExports.forEach((n) => checkAndReportError(n, nonStoryExportsConfig))
        }
      },
    }
  },
})
