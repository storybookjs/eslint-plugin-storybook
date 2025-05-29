/**
 * @fileoverview Enforce CSF3 format for stories.
 * @see https://storybook.js.org/blog/component-story-format-3-0/
 */

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { isIdentifier, isMemberExpression } from '../utils/ast'

// Properties that indicate CSF2 format when assigned to a story
const CSF2_PROPERTIES = new Set(['args', 'parameters', 'decorators', 'play', 'storyName'])

export = createStorybookRule({
  name: 'only-csf3',
  defaultOptions: [],
  meta: {
    type: 'problem',
    severity: 'error',
    docs: {
      description: 'Enforce Component Story Format 3.0 (CSF3) for stories',
      excludeFromConfig: true,
    },
    schema: [],
    messages: {
      noCSF2Format: 'Story "{{storyName}}" uses CSF2 {{pattern}}. Please migrate to CSF3.',
    },
  },
  create(context) {
    const reportedStories = new Set<string>()
    const pendingReports = new Map<string, { node: TSESTree.Node; pattern: string }>()

    const report = (storyName: string, node: TSESTree.Node, pattern: string): void => {
      if (!reportedStories.has(storyName)) {
        reportedStories.add(storyName)
        context.report({
          node,
          messageId: 'noCSF2Format',
          data: {
            storyName,
            pattern,
          },
        })
      }
    }

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        const decl = node.declaration
        if (!decl) return

        // Function declarations
        if (decl.type === AST_NODE_TYPES.FunctionDeclaration && decl.id) {
          report(decl.id.name, decl, 'function declaration')
          return
        }

        // Arrow/function expressions: delay reporting until we know if there are property assignments
        if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
          const declarator = decl.declarations[0]
          if (
            declarator?.init &&
            declarator.id &&
            declarator.id.type === AST_NODE_TYPES.Identifier
          ) {
            if (declarator.init.type === AST_NODE_TYPES.ArrowFunctionExpression) {
              pendingReports.set(declarator.id.name, {
                node: declarator.init,
                pattern: 'arrow function',
              })
            } else if (declarator.init.type === AST_NODE_TYPES.FunctionExpression) {
              pendingReports.set(declarator.id.name, {
                node: declarator.init,
                pattern: 'function expression',
              })
            }
          }
        }
      },

      AssignmentExpression(node: TSESTree.AssignmentExpression) {
        if (
          !isMemberExpression(node.left) ||
          !isIdentifier(node.left.object) ||
          !isIdentifier(node.left.property)
        ) {
          return
        }
        const propertyName = node.left.property.name
        const storyName = node.left.object.name

        if (CSF2_PROPERTIES.has(propertyName) && !reportedStories.has(storyName)) {
          // Remove any pending arrow/function report for this story
          pendingReports.delete(storyName)
          report(storyName, node, `property assignment (.${propertyName})`)
        }
      },

      'Program:exit'() {
        // Report any remaining arrow/function expression reports
        for (const [storyName, { node, pattern }] of pendingReports) {
          if (!reportedStories.has(storyName)) {
            report(storyName, node, pattern)
          }
        }
        pendingReports.clear()
      },
    }
  },
})
