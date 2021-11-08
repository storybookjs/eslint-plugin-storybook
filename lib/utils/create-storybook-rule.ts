import { ESLintUtils } from '@typescript-eslint/experimental-utils'

import { docsUrl } from '../utils'
import { StorybookRuleMeta } from '../types'

export function createStorybookRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string
>({
  create,
  meta,
  ...remainingConfig
}: Readonly<{
  name: string
  meta: StorybookRuleMeta<TMessageIds, TOptions>
  defaultOptions: Readonly<TOptions>
  create: any
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
