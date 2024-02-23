import type { TSESTree } from '@typescript-eslint/utils'

export type TypedNode<NodeType> = TSESTree.Node & { type: NodeType }

export type SpreadProperty = TSESTree.SpreadElement & {
  argument: TSESTree.Identifier
  parent: { parent: NamedVariableDeclarator }
}

export type NamedProperty = TSESTree.Property & { key: TSESTree.Identifier }

export type NamedExportSpecifier = TSESTree.ExportSpecifier & { local: TSESTree.Identifier }

export type NamedVariableDeclarator = TSESTree.VariableDeclarator & { id: TSESTree.Identifier }

export type NamedVariableDeclaration = NamedExportSpecifier | NamedVariableDeclarator

export type NamedAssignment = TSESTree.AssignmentExpression & {
  left: TSESTree.MemberExpression & {
    property: TSESTree.Identifier
    object: TSESTree.Identifier
  }
}
