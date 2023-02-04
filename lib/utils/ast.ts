import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { RuleContext } from '../types'
import { NamedVariableDeclarator, TypedNode } from '../types/ast'
export { ASTUtils } from '@typescript-eslint/utils'

const isNodeOfType =
  <NodeType extends AST_NODE_TYPES>(nodeType: NodeType) =>
  (node: TSESTree.Node | null | undefined): node is TypedNode<NodeType> =>
    node?.type === nodeType

export const isAwaitExpression = isNodeOfType(AST_NODE_TYPES.AwaitExpression)
export const isIdentifier = isNodeOfType(AST_NODE_TYPES.Identifier)
export const isVariableDeclarator = isNodeOfType(AST_NODE_TYPES.VariableDeclarator)

export const isArrayExpression = isNodeOfType(AST_NODE_TYPES.ArrayExpression)
export const isArrowFunctionExpression = isNodeOfType(AST_NODE_TYPES.ArrowFunctionExpression)
export const isBlockStatement = isNodeOfType(AST_NODE_TYPES.BlockStatement)
export const isCallExpression = isNodeOfType(AST_NODE_TYPES.CallExpression)
export const isExpressionStatement = isNodeOfType(AST_NODE_TYPES.ExpressionStatement)
export const isVariableDeclaration = isNodeOfType(AST_NODE_TYPES.VariableDeclaration)
export const isExportNamedDeclaration = isNodeOfType(AST_NODE_TYPES.ExportNamedDeclaration)
export const isAssignmentExpression = isNodeOfType(AST_NODE_TYPES.AssignmentExpression)
export const isSequenceExpression = isNodeOfType(AST_NODE_TYPES.SequenceExpression)
export const isImportDeclaration = isNodeOfType(AST_NODE_TYPES.ImportDeclaration)
export const isImportDefaultSpecifier = isNodeOfType(AST_NODE_TYPES.ImportDefaultSpecifier)
export const isImportNamespaceSpecifier = isNodeOfType(AST_NODE_TYPES.ImportNamespaceSpecifier)
export const isImportSpecifier = isNodeOfType(AST_NODE_TYPES.ImportSpecifier)
export const isJSXAttribute = isNodeOfType(AST_NODE_TYPES.JSXAttribute)
export const isLiteral = isNodeOfType(AST_NODE_TYPES.Literal)
export const isMemberExpression = isNodeOfType(AST_NODE_TYPES.MemberExpression)
export const isNewExpression = isNodeOfType(AST_NODE_TYPES.NewExpression)
export const isObjectExpression = isNodeOfType(AST_NODE_TYPES.ObjectExpression)
export const isObjectPattern = isNodeOfType(AST_NODE_TYPES.ObjectPattern)
export const isProperty = isNodeOfType(AST_NODE_TYPES.Property)
export const isSpreadElement = isNodeOfType(AST_NODE_TYPES.SpreadElement)
export const isReturnStatement = isNodeOfType(AST_NODE_TYPES.ReturnStatement)
export const isFunctionDeclaration = isNodeOfType(AST_NODE_TYPES.FunctionDeclaration)
export const isFunctionExpression = isNodeOfType(AST_NODE_TYPES.FunctionExpression)
export const isProgram = isNodeOfType(AST_NODE_TYPES.Program)
export const isTSTypeAliasDeclaration = isNodeOfType(AST_NODE_TYPES.TSTypeAliasDeclaration)
export const isTSInterfaceDeclaration = isNodeOfType(AST_NODE_TYPES.TSInterfaceDeclaration)
export const isTSAsExpression = isNodeOfType(AST_NODE_TYPES.TSAsExpression)
export const isTSSatisfiesExpression = isNodeOfType(AST_NODE_TYPES.TSSatisfiesExpression)
export const isTSNonNullExpression = isNodeOfType(AST_NODE_TYPES.TSNonNullExpression)
export const isMetaProperty = isNodeOfType(AST_NODE_TYPES.MetaProperty)

export const TOP_VARIABLE_DECLARATOR_DEPTH = 2
export const TOP_VARIABLE_PROP_DECLARATION_DEPTH = 4
export const TOP_EXPORT_PROP_DECLARATION_DEPTH = 5
export const TOP_PARAM_ASSIGNMENT_DEPTH = 2
export const PROPERTY_DECLARATOR_OFFSET = -2

export function getPropertyParentName(context: RuleContext) {
  const [objectDeclaration] = context.getAncestors().slice(PROPERTY_DECLARATOR_OFFSET)
  if (!isVariableDeclarator(objectDeclaration) || !isNamedVariableDeclaration(objectDeclaration)) {
    throw new Error("Could not get property's parent object name")
  }

  return objectDeclaration.id.name
}

export function isNamedVariableDeclaration(
  declaration: TSESTree.Node
): declaration is NamedVariableDeclarator {
  return isVariableDeclarator(declaration) && isIdentifier(declaration.id)
}

export function isTopLevelVariableDeclarator(
  node: TSESTree.Node,
  context: RuleContext
): node is NamedVariableDeclarator {
  return (
    isNamedVariableDeclaration(node) &&
    context.getAncestors().length === TOP_VARIABLE_DECLARATOR_DEPTH
  )
}

export function isTopLevelObjectProperty(context: RuleContext) {
  return [TOP_VARIABLE_PROP_DECLARATION_DEPTH, TOP_EXPORT_PROP_DECLARATION_DEPTH].includes(
    context.getAncestors().length
  )
}

export function isTopLevelParamAssignment(context: RuleContext) {
  return context.getAncestors().length === TOP_PARAM_ASSIGNMENT_DEPTH
}
