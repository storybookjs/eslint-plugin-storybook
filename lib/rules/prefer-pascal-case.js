/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code', // Or `code` or `whitespace`
    docs: {
      description: 'Stories should use PascalCase  I am changing this',
      category: 'csf',
      recommended: true,
      recommendedConfig: 'warn',
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      fixSuggestion: 'Use pascal case',
      description: 'The story should use PascalCase notation: {{name}}'
    },
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isPascalCase = (str) => /^[A-Z]+([a-z0-9]?)+/.test(str)
    const toPascalCase = (str) => {
      return str
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
          new RegExp(/\s+(.)(\w+)/, 'g'),
          ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ExportNamedDeclaration': function (node) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) return;

        const { type } = node.declaration;

        if (
          type === 'TSTypeAliasDeclaration' ||
          type === 'TypeAlias' ||
          type === 'TSInterfaceDeclaration' ||
          type === 'InterfaceDeclaration'
        ) {
          return;
        }
        const identifier = node.declaration.declarations[0].id
        if (identifier) {
          const { name } = identifier
          if (!isPascalCase(name)) {
            context.report({
              node: identifier,
              messageId: 'description',
              data: { name },
              suggest: [
                {
                  messageId: 'fixSuggestion',
                  fix: function (fixer) {
                    return fixer.replaceTextRange(identifier.range, toPascalCase(name))
                  },
                },
              ],
            })
          }
        }
      }
    }
  },
}
