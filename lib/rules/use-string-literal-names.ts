/**
 * @fileoverview Use string literals to override a story name
 * @author Charles Gruenais
 */

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import { isLiteral } from '../utils/ast'
import { extractStories } from '../utils/stories'

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
      [messageId]: 'Story names can only be overridden by string literals',
    },
    schema: [],
  },

  create(context) {
    return extractStories(context, (output) => {
      const properties = output.getProperties(['name', 'storyName'])
      properties.forEach(({ valueNode: node }) => {
        if (!isLiteral(node)) {
          context.report({ node, messageId })
        }
      })
    })
  },
})
