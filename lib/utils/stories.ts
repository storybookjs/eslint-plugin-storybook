import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import type { RuleContext } from '../types'
import type { NamedAssignment, NamedProperty, SpreadProperty } from '../types/ast'
import type {
  SpreadContentCandidates,
  StoryDeclarationCandidates,
  StoryExports,
  StoryPropertyCandidates,
} from '../types/stories'
import {
  getPropertyParentName,
  isIdentifier,
  isMemberExpression,
  isNamedVariableDeclaration,
  isTopLevelObjectProperty,
  isTopLevelParamAssignment,
  isTopLevelVariableDeclarator,
  isVariableDeclaration,
} from './ast'
import { StoryIndexer } from './StoryIndexer'

const STORY_KEY_SEP = '.'
const getKey = (...args: string[]) => args.join(STORY_KEY_SEP)

export function isStoryPropertyCandidate(
  node: TSESTree.Property,
  context: RuleContext
): node is NamedProperty {
  return isIdentifier(node.key) && isTopLevelObjectProperty(context)
}

export function isStoryAssignmentCandidate(
  node: TSESTree.AssignmentExpression,
  context: RuleContext
): node is NamedAssignment {
  return (
    isTopLevelParamAssignment(context) &&
    isMemberExpression(node.left) &&
    isIdentifier(node.left.object)
  )
}

export function isSpreadContentCandidate(
  node: TSESTree.SpreadElement,
  context: RuleContext
): node is SpreadProperty {
  return isTopLevelObjectProperty(context) && isIdentifier(node.argument)
}

/**
 * Wrapper utility to extract list of stories and their properties while ESLint
 * traverses the document. It can be used to specifically target Story-related
 * pieces of code when running validation.
 *
 * @param context ESLint's `RuleContext`.
 *
 * @param callback Extraction callback function fired once ESLint has finished
 * traversing the document. Its first and only argument exposes an instance of
 * `StoryIndexer`, which provides a small API to help with running CSF-related
 * validation.
 *
 * @param listener Some rules may benefit from this wrapper, but still need to
 * run additional logic while traversing the document. This argument addresses
 * that need. It accepts ESLint's regular `RuleListener`, so that one's custom
 * logic is run along with the Story extraction logic.
 */
export function extractStories<Context extends RuleContext>(
  context: Context,
  callback: (output: StoryIndexer) => void,
  listener: TSESLint.RuleListener = {}
): TSESLint.RuleListener {
  const spreadContentCandidates: SpreadContentCandidates = new Map()
  const storyPropertyCandidates: StoryPropertyCandidates = new Map()
  const storyDeclarationCandidates: StoryDeclarationCandidates = new Map()
  const storyExports: StoryExports = new Map()

  return {
    ...listener,

    /**
     * In CSF, `ExportNamedDeclaration`s translate to stories. Because exports
     * can be specified before actual declarations, we need to track them all.
     */
    ExportNamedDeclaration: function (node) {
      // e.g. `export { A, B }` (see `VariableDeclaration` for further notes)
      if (node.specifiers.length) {
        node.specifiers.forEach((specifier) => {
          storyExports.set(specifier.local.name, undefined)
        })
      }

      // e.g. `export const A = {}, B = {}`
      if (node.declaration && isVariableDeclaration(node.declaration)) {
        node.declaration.declarations.forEach((declaration) => {
          if (isNamedVariableDeclaration(declaration)) {
            storyExports.set(declaration.id.name, declaration)
          }
        })
      }

      listener.ExportNamedDeclaration?.(node)
    },

    /**
     * Because of modules' flexibility, stories could be declared before they are
     * actually exported and therefore considered as Stories. Since we do want to
     * attach any report to declarations instead of exports, tracking is required.
     */
    VariableDeclarator: function (node) {
      if (isTopLevelVariableDeclarator(node, context)) {
        storyDeclarationCandidates.set(node.id.name, {
          declarationValue: node.init,
        })
      }

      listener.VariableDeclarator?.(node)
    },

    /**
     * Because of static analysis limitations, only top-level objects' properties
     * are considered to actually be potential story properties. Let's track them.
     */
    Property: function (node) {
      // e.g. `const A = { property: 'foo' }; export const B = { property: 'bar' }`
      if (isStoryPropertyCandidate(node, context)) {
        const parentName = getPropertyParentName(context)
        const propertyName = node.key.name
        storyPropertyCandidates.set(getKey(parentName, propertyName), {
          parentName,
          propertyName,
          propertyNameNode: node.key,
          propertyValueNode: node.value,
        })
      }

      listener.Property?.(node)
    },

    /**
     * Story properties can also be mutated after the story was defined. This was
     * a common pattern back with CSF2, which still needs to be supported for now.
     */
    AssignmentExpression: function (node) {
      // e.g. `A.property = …`
      if (isStoryAssignmentCandidate(node, context)) {
        const parentName = node.left.object.name
        const propertyName = node.left.property.name
        storyPropertyCandidates.set(getKey(parentName, propertyName), {
          parentName,
          propertyName,
          propertyNameNode: node.left.property,
          propertyValueNode: node.right,
        })
      }

      listener.AssignmentExpression?.(node)
    },

    /**
     * Story properties may also be set by spreading declared variables. Since we
     * do want to also validate spread properties, we have to track all top-level
     * spread elements.
     */
    SpreadElement: function (node) {
      if (isSpreadContentCandidate(node, context)) {
        const parentName = node.parent.parent.id.name
        const spreadName = node.argument.name
        spreadContentCandidates.set(spreadName, [
          ...(spreadContentCandidates.get(spreadName) ?? []),
          parentName,
        ])
      }

      listener.SpreadElement?.(node)
    },

    /**
     * Once the whole file has been traversed and analyzed, we shall cross all
     * gathered data to output a map of exported stories, and their respective
     * properties.
     */
    'Program:exit': function (program) {
      callback(
        new StoryIndexer(
          storyPropertyCandidates,
          storyDeclarationCandidates,
          spreadContentCandidates,
          storyExports
        )
      )
      listener['Program:exit']?.(program)
    },
  }
}
