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
  defaultOptions: Readonly<TOptions>
  create: (
    context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>
  ) => TRuleListener
}>) {
  return ESLintUtils.RuleCreator<StorybookRuleMetaDocs>(docsUrl)({
    ...remainingConfig,
    create,
    meta: {
      ...meta,
      docs: {
        ...meta.docs!,
      },
    },
  })
}
