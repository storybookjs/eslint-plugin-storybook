import { TSESLint } from '@typescript-eslint/utils'
import { CategoryId } from '../utils/constants'

export type RuleModule = TSESLint.RuleModule<'', []> & {
  meta: { hasSuggestions?: boolean; docs: { recommendedConfig?: 'error' | 'warn' } }
}

// These 2 types are copied from @typescript-eslint/experimental-utils' CreateRuleMeta
// and modified to our needs
export type StorybookRuleMetaDocs<TOptions extends readonly unknown[]> = Omit<
  TSESLint.RuleMetaDataDocs<TOptions>,
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
  TOptions extends readonly unknown[],
> = Omit<TSESLint.RuleMetaData<TMessageIds, TOptions>, 'docs'> & {
  docs: StorybookRuleMetaDocs<TOptions>
}

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
