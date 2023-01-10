import { IncludeExcludeOptions, isExportStory } from '@storybook/csf'

import { ASTUtils, TSESTree, TSESLint } from '@typescript-eslint/utils'
import { NamedVariable, ObjectLiteralItem, StoryDescriptor } from '../types'

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

/**
 * Descriptors support regexes and arrays of strings
 * https://github.com/storybookjs/storybook/blob/next/code/lib/csf-tools/src/CsfFile.ts#L16
 */
export const getDescriptor = (
  metaDeclaration: TSESTree.ObjectExpression,
  propertyName: string
): StoryDescriptor | undefined => {
  const value =
    metaDeclaration && getObjectBareProperty(metaDeclaration.properties, propertyName)?.value

  if (!value) {
    return undefined
  }

  switch (value.type) {
    case 'ArrayExpression':
      return value.elements.map((element) => {
        if (!isLiteral(element) || typeof element.value !== 'string') {
          throw new Error(`Unexpected descriptor array element: ${element.type}`)
        }
        return element.value
      })
    case 'Literal':
      if (!(value.value instanceof RegExp)) {
        throw new Error(`Unexpected descriptor: ${value.type}`)
      }
      return value.value
    default:
      throw new Error(`Unexpected descriptor: ${value.type}`)
  }
}

export const isValidStoryExport = (
  node: TSESTree.Identifier,
  nonStoryExportsConfig: IncludeExcludeOptions
) => isExportStory(node.name, nonStoryExportsConfig) && node.name !== '__namedExportsOrder'

export const getAllNamedExports = (node: TSESTree.ExportNamedDeclaration) => {
  const namedReferences = getExportNamedReferences(node)
  if (namedReferences) return namedReferences

  const namedIdentifiers = getExportNamedIdentifierDeclarations(node)
  if (namedIdentifiers) return namedIdentifiers.map(({ id }) => id)

  const namedFunction = getExportNamedFunctionDeclaration(node)
  if (namedFunction?.id) return [namedFunction.id]

  return []
}

/** e.g. `export { First, Two } `*/
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

/** e.g. `export function MyStory() { } => 'MyStory'` */
export const getExportNamedFunctionDeclaration = (
  node: TSESTree.ExportNamedDeclaration
): TSESTree.FunctionDeclaration | undefined => {
  const { declaration } = node
  if (isFunctionDeclaration(declaration) && isIdentifier(declaration.id)) {
    return declaration
  }
}

/** e.g. `export const MyStory = () => {}` => `"MyStory", MyOtherStory = () => {}` */
export const getExportNamedIdentifierDeclarations = (
  node: TSESTree.ExportNamedDeclaration,
  name?: string
): NamedVariable[] | undefined => {
  const { declaration } = node
  const matchesNameFilter = (exportName: string) => !name || exportName === name
  if (isVariableDeclaration(declaration)) {
    const declarations = declaration.declarations.filter(
      (decl) => isIdentifier(decl.id) && matchesNameFilter(decl.id.name)
    ) as NamedVariable[]
    if (declarations.length > 0) {
      return declarations
    }
  }
}

export const getExportNamedIdentifierDeclaration = (
  node: TSESTree.ExportNamedDeclaration,
  name?: string
): NamedVariable | undefined => {
  const [declaration] = getExportNamedIdentifierDeclarations(node, name) ?? []
  return declaration
}

/** e.g. `{ myProperty: {…}, myMethod(){…} }` */
export const getObjectBareProperty = (properties: TSESTree.ObjectLiteralElement[], name: string) =>
  properties.find(
    (property) =>
      isProperty(property) &&
      isIdentifier(property.key) &&
      !isSpreadElement(property) &&
      property.key.name === name
  ) as ObjectLiteralItem | undefined

export const getObjectBarePropertyValue = (property: ObjectLiteralItem) =>
  isLiteral(property.value) && property.value.value
