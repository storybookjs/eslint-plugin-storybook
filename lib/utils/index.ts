import { ExportDefaultDeclaration, Node } from '@typescript-eslint/types/dist/ast-spec'
import { findVariable } from '@typescript-eslint/experimental-utils/dist/ast-utils'
import { isIdentifier, isObjectExpression, isTSAsExpression, isVariableDeclarator } from './ast'

export const docsUrl = (ruleName: any) =>
  `https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/${ruleName}.md`

export const isPlayFunction = (node: any) => {
  const propertyName = node.left && node.left.property && node.left.property.name
  return propertyName === 'play'
}

export const getMetaObjectExpression = (node: ExportDefaultDeclaration, context: any) => {
  let meta = node.declaration
  if (isIdentifier(meta)) {
    const variable = findVariable(context.getScope(), meta.name)
    const decl = variable && variable.defs.find((def) => isVariableDeclarator(def.node))
    if (decl && isVariableDeclarator(decl.node)) {
      meta = decl.node.init
    }
  }
  if (isTSAsExpression(meta)) {
    meta = meta.expression
  }

  return isObjectExpression(meta) ? meta : null
}
