import { ESLintUtils, TSESLint } from '@typescript-eslint/utils'

import { docsUrl } from './index'
import { StorybookRuleMeta, StorybookRuleMetaDocs } from '../types'

export function createStorybookRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TRuleListener extends TSESLint.RuleListener = TSESLint.RuleListener,
>({
  create,
  meta,
  ...remainingConfig
}: Readonly<{
  name: string
  meta: StorybookRuleMeta<TMessageIds>
  defaultOptions: TOptions
  create: (
    context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>
  ) => TRuleListener
}>) {
  const ruleCreator = ESLintUtils.RuleCreator(docsUrl)
  return ruleCreator({
    ...remainingConfig,
    create,
    meta: {
      ...meta,
      docs: {
        ...meta.docs!,
      },
      defaultOptions: remainingConfig.defaultOptions,
    },
  })
}
