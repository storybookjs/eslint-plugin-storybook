import { TSESLint } from '@typescript-eslint/utils'
import { CategoryId } from '../utils/constants'
import {
  RuleRecommendation,
  RuleRecommendationAcrossConfigs,
} from '@typescript-eslint/utils/ts-eslint'

export type RuleModule = TSESLint.RuleModule<'', []> & {
  meta: { hasSuggestions?: boolean; docs: { recommendedConfig?: 'error' | 'warn' } }
}

// These 2 types are copied from @typescript-eslint/experimental-utils' CreateRuleMeta
// and modified to our needs
export type StorybookRuleMetaDocs = TSESLint.RuleMetaDataDocs & {
  /**
   * Whether or not this rule should be excluded from linter config
   */
  excludeFromConfig?: boolean
  /**
   * Which configs the rule should be part of
   */
  categories?: CategoryId[]

  /**
   * If a string config name, which starting config this rule is enabled in.
   * If an object, which settings it has enabled in each of those configs.
   */
  recommended?: RuleRecommendation | RuleRecommendationAcrossConfigs<unknown[]>
}

export type StorybookRuleMeta<TMessageIds extends string> = TSESLint.RuleMetaData<
  TMessageIds,
  StorybookRuleMetaDocs
>

// Comment out for testing purposes:
// const docs: StorybookRuleMetaDocs = {
//   description: 'bla',
//   recommended: 'strict',
// }

// const meta: StorybookRuleMeta<'someId'> = {
//   messages: {
//     someId: 'yea',
//   },
//   type: 'problem',
//   schema: [],
//   docs,
// }
