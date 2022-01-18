import { isExportStory } from '@storybook/csf'
import { ExportDefaultDeclaration } from '@typescript-eslint/types/dist/ast-spec'
import { ASTUtils } from '@typescript-eslint/experimental-utils'
import {
  isFunctionDeclaration,
  isIdentifier,
  isObjectExpression,
  isTSAsExpression,
  isVariableDeclaration,
  isVariableDeclarator,
} from './ast'

export const docsUrl = (ruleName: any) =>
  `https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/${ruleName}.md`

export const isPlayFunction = (node: any) => {
  const propertyName = node.left && node.left.property && node.left.property.name
  return propertyName === 'play'
}

export const getMetaObjectExpression = (node: ExportDefaultDeclaration, context: any) => {
  let meta = node.declaration
  if (isIdentifier(meta)) {
    const variable = ASTUtils.findVariable(context.getScope(), meta.name)
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

export const getDescriptor = (metaDeclaration, propertyName) => {
  const property =
    metaDeclaration && metaDeclaration.properties.find((p) => p.key && p.key.name === propertyName)
  if (!property) {
    return undefined
  }

  const { type } = property.value

  switch (type) {
    case 'ArrayExpression':
      return property.value.elements.map((t) => {
        if (!['StringLiteral', 'Literal'].includes(t.type)) {
          throw new Error(`Unexpected descriptor element: ${t.type}`)
        }
        return t.value
      })
    case 'Literal':
    case 'RegExpLiteral':
      return property.value.value
    default:
      throw new Error(`Unexpected descriptor: ${type}`)
  }
}

export const isValidStoryExport = (node, nonStoryExportsConfig) =>
  isExportStory(node.name, nonStoryExportsConfig) && node.name !== '__namedExportsOrder'

export const getAllNamedExports = (node) => {
  // e.g. `export { MyStory }`
  if (!node.declaration && node.specifiers) {
    return node.specifiers.reduce((acc, specifier) => {
      if (isIdentifier(specifier.exported)) {
        acc.push(specifier.exported)
      }
      return acc
    }, [])
  }

  const decl = node.declaration
  if (isVariableDeclaration(decl)) {
    const { id } = decl.declarations[0]
    // e.g. `export const MyStory`
    if (isIdentifier(id)) {
      return [id]
    }
  }

  if (isFunctionDeclaration(decl)) {
    // e.g. `export function MyStory() {}`
    if (isIdentifier(decl.id)) {
      return [decl.id]
    }
  }

  return []
}
