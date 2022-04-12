import { ESLintUtils } from '@typescript-eslint/experimental-utils'

import { docsUrl } from '../utils'
import { StorybookRuleMeta } from '../types'
import { RuleContext, RuleListener } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

export function createStorybookRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TRuleListener extends RuleListener = RuleListener
>({
  create,
  meta,
  ...remainingConfig
}: Readonly<{
  name: string
  meta: StorybookRuleMeta<TMessageIds, TOptions>
  defaultOptions: Readonly<TOptions>
  create: (
    context: Readonly<RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>
  ) => TRuleListener
}>) {
  return ESLintUtils.RuleCreator(docsUrl)({
    ...remainingConfig,
    create,
    meta: {
      ...meta,
      docs: {
        ...meta.docs,
      },
    },
  })
}
