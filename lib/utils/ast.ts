// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { AST_NODE_TYPES, ASTUtils } = require('@typescript-eslint/experimental-utils')

const isNodeOfType = (nodeType: any) => (node: any) => node && node.type === nodeType

const isArrayExpression = isNodeOfType(AST_NODE_TYPES.ArrayExpression)
const isArrowFunctionExpression = isNodeOfType(AST_NODE_TYPES.ArrowFunctionExpression)
const isBlockStatement = isNodeOfType(AST_NODE_TYPES.BlockStatement)
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isCallExpr... Remove this comment to see the full error message
const isCallExpression = isNodeOfType(AST_NODE_TYPES.CallExpression)
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isExpressi... Remove this comment to see the full error message
const isExpressionStatement = isNodeOfType(AST_NODE_TYPES.ExpressionStatement)
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isVariable... Remove this comment to see the full error message
const isVariableDeclaration = isNodeOfType(AST_NODE_TYPES.VariableDeclaration)
const isAssignmentExpression = isNodeOfType(AST_NODE_TYPES.AssignmentExpression)
const isSequenceExpression = isNodeOfType(AST_NODE_TYPES.SequenceExpression)
const isImportDeclaration = isNodeOfType(AST_NODE_TYPES.ImportDeclaration)
const isImportDefaultSpecifier = isNodeOfType(AST_NODE_TYPES.ImportDefaultSpecifier)
const isImportNamespaceSpecifier = isNodeOfType(AST_NODE_TYPES.ImportNamespaceSpecifier)
const isImportSpecifier = isNodeOfType(AST_NODE_TYPES.ImportSpecifier)
const isJSXAttribute = isNodeOfType(AST_NODE_TYPES.JSXAttribute)
const isLiteral = isNodeOfType(AST_NODE_TYPES.Literal)
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isMemberEx... Remove this comment to see the full error message
const isMemberExpression = isNodeOfType(AST_NODE_TYPES.MemberExpression)
const isNewExpression = isNodeOfType(AST_NODE_TYPES.NewExpression)
const isObjectExpression = isNodeOfType(AST_NODE_TYPES.ObjectExpression)
const isObjectPattern = isNodeOfType(AST_NODE_TYPES.ObjectPattern)
const isProperty = isNodeOfType(AST_NODE_TYPES.Property)
const isReturnStatement = isNodeOfType(AST_NODE_TYPES.ReturnStatement)
const isFunctionExpression = isNodeOfType(AST_NODE_TYPES.FunctionExpression)

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
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
