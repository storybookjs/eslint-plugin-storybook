const { AST_NODE_TYPES, ASTUtils } = require('@typescript-eslint/experimental-utils')

const isNodeOfType = (nodeType) => (node) => node && node.type === nodeType

const isArrayExpression = isNodeOfType(AST_NODE_TYPES.ArrayExpression)
const isArrowFunctionExpression = isNodeOfType(AST_NODE_TYPES.ArrowFunctionExpression)
const isBlockStatement = isNodeOfType(AST_NODE_TYPES.BlockStatement)
const isCallExpression = isNodeOfType(AST_NODE_TYPES.CallExpression)
const isExpressionStatement = isNodeOfType(AST_NODE_TYPES.ExpressionStatement)
const isVariableDeclaration = isNodeOfType(AST_NODE_TYPES.VariableDeclaration)
const isAssignmentExpression = isNodeOfType(AST_NODE_TYPES.AssignmentExpression)
const isSequenceExpression = isNodeOfType(AST_NODE_TYPES.SequenceExpression)
const isImportDeclaration = isNodeOfType(AST_NODE_TYPES.ImportDeclaration)
const isImportDefaultSpecifier = isNodeOfType(AST_NODE_TYPES.ImportDefaultSpecifier)
const isImportNamespaceSpecifier = isNodeOfType(AST_NODE_TYPES.ImportNamespaceSpecifier)
const isImportSpecifier = isNodeOfType(AST_NODE_TYPES.ImportSpecifier)
const isJSXAttribute = isNodeOfType(AST_NODE_TYPES.JSXAttribute)
const isLiteral = isNodeOfType(AST_NODE_TYPES.Literal)
const isMemberExpression = isNodeOfType(AST_NODE_TYPES.MemberExpression)
const isNewExpression = isNodeOfType(AST_NODE_TYPES.NewExpression)
const isObjectExpression = isNodeOfType(AST_NODE_TYPES.ObjectExpression)
const isObjectPattern = isNodeOfType(AST_NODE_TYPES.ObjectPattern)
const isProperty = isNodeOfType(AST_NODE_TYPES.Property)
const isReturnStatement = isNodeOfType(AST_NODE_TYPES.ReturnStatement)
const isFunctionExpression = isNodeOfType(AST_NODE_TYPES.FunctionExpression)

module.exports = Object.assign(
  {
    isArrayExpression,
    isArrowFunctionExpression,
    isBlockStatement,
    isCallExpression,
    isExpressionStatement,
    isVariableDeclaration,
    isAssignmentExpression,
    isSequenceExpression,
    isImportDeclaration,
    isImportDefaultSpecifier,
    isImportNamespaceSpecifier,
    isImportSpecifier,
    isJSXAttribute,
    isLiteral,
    isMemberExpression,
    isNewExpression,
    isObjectExpression,
    isObjectPattern,
    isProperty,
    isReturnStatement,
    isFunctionExpression,
  },
  ASTUtils
)
