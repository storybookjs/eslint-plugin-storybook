import { TSESLint } from '@typescript-eslint/utils'
import { CategoryId } from '../utils/constants'

export type RuleContext = Readonly<TSESLint.RuleContext<string, unknown[]>>

export type RuleModule = TSESLint.RuleModule<'', []> & {
  meta: { hasSuggestions?: boolean; docs: { recommendedConfig?: 'error' | 'warn' } }
}

// These 2 types are copied from @typescript-eslint/experimental-utils' CreateRuleMeta
// and modified to our needs
export type StorybookRuleMetaDocs = Omit<TSESLint.RuleMetaDataDocs, 'url'> & {
  /**
   * Whether or not this rule should be excluded from linter config
   */
  excludeFromConfig?: boolean
  /**
   * Which configs the rule should be part of
   */
  categories?: CategoryId[]
}

export type StorybookRuleMeta<TMessageIds extends string> = Omit<
  TSESLint.RuleMetaData<TMessageIds>,
  'docs'
> & {
  docs: StorybookRuleMetaDocs
}

// Comment out for testing purposes:
// const docs: StorybookRuleMetaDocs = {
//   description: 'bla',
//   recommended: 'error',
// }

// const meta: StorybookRuleMeta<'someId'> = {
//   messages: {
//     someId: 'yea',
//   },
//   type: 'problem',
//   schema: [],
//   docs,
// }
