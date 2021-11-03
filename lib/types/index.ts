import { Rule } from 'eslint'

export type RuleModule = Rule.RuleModule & {
  meta: { hasSuggestions?: boolean; docs: { recommendedConfig?: 'error' | 'warn' } }
}
