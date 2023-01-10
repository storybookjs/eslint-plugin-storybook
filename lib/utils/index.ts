import { IncludeExcludeOptions, isExportStory } from '@storybook/csf'

import { ASTUtils, TSESTree, TSESLint } from '@typescript-eslint/utils'
import { NamedVariable } from '../types'

import {
  isFunctionDeclaration,
  isIdentifier,
  isLiteral,
  isObjectExpression,
  isProperty,
  isSpreadElement,
  isTSAsExpression,
  isTSSatisfiesExpression,
  isVariableDeclaration,
  isVariableDeclarator,
} from './ast'

export const docsUrl = (ruleName: string) =>
  `https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/${ruleName}.md`

export const getMetaObjectExpression = (
  node: TSESTree.ExportDefaultDeclaration,
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>
) => {
  let meta: TSESTree.ExportDefaultDeclaration['declaration'] | null = node.declaration
  if (isIdentifier(meta)) {
    const variable = ASTUtils.findVariable(context.getScope(), meta.name)
    const decl = variable && variable.defs.find((def) => isVariableDeclarator(def.node))
    if (decl && isVariableDeclarator(decl.node)) {
      meta = decl.node.init
    }
  }
  if (isTSAsExpression(meta) || isTSSatisfiesExpression(meta)) {
    meta = meta.expression
  }

  return isObjectExpression(meta) ? meta : null
}

export const getDescriptor = (
  metaDeclaration: TSESTree.ObjectExpression,
  propertyName: string
): string[] | RegExp | undefined => {
  const property =
    metaDeclaration &&
    metaDeclaration.properties.find(
      (p) => 'key' in p && 'name' in p.key && p.key.name === propertyName
    )

  if (!property || isSpreadElement(property)) {
    return undefined
  }

  const { type } = property.value

  switch (type) {
    case 'ArrayExpression':
      return property.value.elements.map((t) => {
        if (!['StringLiteral', 'Literal'].includes(t.type)) {
          throw new Error(`Unexpected descriptor element: ${t.type}`)
        }
        // @ts-expect-error TODO: t should be only StringLiteral or Literal, and the type is not resolving correctly
        return t.value
      })
    case 'Literal':
      // // TODO: Investigation needed. Type systems says, that "RegExpLiteral" does not exist
      // // @ts-ignore
      // case 'RegExpLiteral':
      //   // @ts-ignore
      return property.value.value as any
    default:
      throw new Error(`Unexpected descriptor: ${type}`)
  }
}

export const isValidStoryExport = (
  node: TSESTree.Identifier,
  nonStoryExportsConfig: IncludeExcludeOptions
) => isExportStory(node.name, nonStoryExportsConfig) && node.name !== '__namedExportsOrder'

export const getAllNamedExports = (node: TSESTree.ExportNamedDeclaration) => {
  const namedReferences = getExportNamedReferences(node)
  if (namedReferences) return namedReferences

  const namedIdentifier = getExportNamedIdentifierDeclaration(node)
  if (namedIdentifier?.id) return [namedIdentifier.id]

  const namedFunction = getExportNamedFunctionDeclaration(node)
  if (namedFunction?.id) return [namedFunction.id]

  return []
}

/** e.g. `export { First, Two }` => `['First', 'Two']`*/
export const getExportNamedReferences = (
  node: TSESTree.ExportNamedDeclaration
): TSESTree.Identifier[] | undefined => {
  if (!node.declaration && node.specifiers) {
    return node.specifiers.reduce((acc, specifier) => {
      if (isIdentifier(specifier.exported)) {
        acc.push(specifier.exported)
      }
      return acc
    }, [] as TSESTree.Identifier[])
  }
}

/** e.g `export function MyStory() { } => 'MyStory'` */
export const getExportNamedFunctionDeclaration = (
  node: TSESTree.ExportNamedDeclaration
): TSESTree.FunctionDeclaration | undefined => {
  const { declaration } = node
  if (isFunctionDeclaration(declaration) && isIdentifier(declaration.id)) {
    return declaration
  }
}

/** e.g `export const MyStory = () => {}` => `"MyStory"` */
export const getExportNamedIdentifierDeclaration = (
  node: TSESTree.ExportNamedDeclaration
): NamedVariable | undefined => {
  const { declaration } = node
  if (isVariableDeclaration(declaration)) {
    const [decl] = declaration.declarations
    if (decl && isIdentifier(decl.id)) {
      return decl as NamedVariable
    }
  }
}

export const getObjectLiteralProperty = (
  properties: TSESTree.ObjectLiteralElement[],
  name: string
) =>
  properties.find(
    (property) => isProperty(property) && isIdentifier(property.key) && property.key.name === name
  )

export const getObjectLiteralPropertyValue = (property: TSESTree.ObjectLiteralElement) =>
  !isSpreadElement(property) && isLiteral(property.value) && property.value.value
