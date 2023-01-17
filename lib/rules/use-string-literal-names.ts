/**
 * @fileoverview Use string literals to override a story name
 * @author Charles Gruenais
 */

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import { TSESTree } from '@typescript-eslint/utils'
import {
  isExportNamedDeclaration,
  isIdentifier,
  isLiteral,
  isVariableDeclaration,
  isVariableDeclarator,
} from '../utils/ast'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const messageId = 'useStringLiteralName' as const

export = createStorybookRule({
  name: 'use-string-literal-names',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Use string literals to override a story name',
      categories: [CategoryId.RECOMMENDED],
      recommended: 'error',
    },
    messages: {
      [messageId]: 'Fill me in',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
  },

  create(context) {
    const TOP_VARIABLE_DECLARATION_DEPTH = 4
    const TOP_EXPORT_DECLARATION_DEPTH = 5
    const topLevelObjects: Map<string, Parameters<typeof context.report>[0]> = new Map()

    const isTopLevelObjectProperty = () =>
      [TOP_VARIABLE_DECLARATION_DEPTH, TOP_EXPORT_DECLARATION_DEPTH].includes(
        context.getAncestors().length
      )

    const isStoryNamePropertyCandidate = (node: TSESTree.Property) =>
      isIdentifier(node.key) && node.key.name === 'name' && isTopLevelObjectProperty()

    return {
      Property: function (node) {
        if (isStoryNamePropertyCandidate(node)) {
          if (!isLiteral(node.value)) {
            const descriptor = { node, messageId }
            const [declaration, declarator] = context.getAncestors().slice(1, 3)
            if (
              isVariableDeclaration(declaration) &&
              isVariableDeclarator(declarator) &&
              isIdentifier(declarator.id)
            ) {
              topLevelObjects.set(declarator.id.name, descriptor)
            } else if (isExportNamedDeclaration(declaration)) {
              context.report(descriptor)
            }
          }
        }
      },
      ExportNamedDeclaration: function (node) {
        if (node.specifiers.length) {
          node.specifiers.forEach((specifier) => {
            const baseTopLevelObject = topLevelObjects.get(specifier.local.name)
            if (baseTopLevelObject) {
              context.report(baseTopLevelObject)
            }
          })
        }
      },
    }
  },
})
