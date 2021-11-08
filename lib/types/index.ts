import { TSESLint } from '@typescript-eslint/experimental-utils'
import { CategoryId } from '../utils/constants'

export type RuleModule = TSESLint.RuleModule<'', []> & {
  meta: { hasSuggestions?: boolean; docs: { recommendedConfig?: 'error' | 'warn' } }
}

type RecommendedConfig<TOptions extends readonly unknown[]> =
  | TSESLint.RuleMetaDataDocs['recommended']
  | [TSESLint.RuleMetaDataDocs['recommended'], ...TOptions]

// These 2 types are copied from @typescript-eslint/experimental-utils' CreateRuleMeta
// and modified to our needs
export type StorybookRuleMetaDocs<TOptions extends readonly unknown[]> = Omit<
  TSESLint.RuleMetaDataDocs,
  'url'
> & {
  /**
   * Whether or not this rule should be excluded from linter config
   */
  excludeFromConfig?: boolean
  /**
   * Which configs the rule should be part of
   */
  categories?: CategoryId[]
}
export type StorybookRuleMeta<
  TMessageIds extends string,
  TOptions extends readonly unknown[]
> = Omit<TSESLint.RuleMetaData<TMessageIds>, 'docs'> & {
  docs: StorybookRuleMetaDocs<TOptions>
}

// const docs: StorybookRuleMetaDocs<any> = {
//   recommended: true,
//   description: 'bla',
//   recommended: 'error',
// }

// const meta: StorybookRuleMeta<'someId', any> = {
//   messages: {
//     someId: 'yea',
//   },
//   type: 'problem',
//   schema: [],
//   docs,
// }
