import { TSESTree } from '@typescript-eslint/utils'
import { NamedVariableDeclaration } from './ast'

type StoryDeclaration = NamedVariableDeclaration | TSESTree.Expression

export type StoryPropertyDeclaration = {
  storyName: string
  nameNode: TSESTree.Node
  valueNode: TSESTree.Node
}

export type SpreadsMap<SpreadName = string, StoryName = string> = Map<SpreadName, StoryName[]>

export type StoriesMap<StoryExportName = string> = Map<StoryExportName, StoryDeclaration>

export type PropertiesMap<PropertyKey = string> = Map<PropertyKey, StoryPropertyDeclaration[]>

export type StoryExports<StoryExportName = string> = Map<
  StoryExportName,
  NamedVariableDeclaration | undefined
>

export type PropertyDefinition = {
  parentName: string
  propertyName: string
  propertyNameNode: TSESTree.Node
  propertyValueNode: TSESTree.Node
}

export type StoryPropertyCandidates<StoryPropertyKey = string> = Map<
  StoryPropertyKey,
  PropertyDefinition
>

export type StoryDeclarationCandidates<DeclarationName = string> = Map<
  DeclarationName,
  {
    declarationValue: TSESTree.Expression | null
  }
>

export type SpreadContentCandidates<VariableName = string, ParentName = string> = Map<
  VariableName,
  ParentName[]
>
