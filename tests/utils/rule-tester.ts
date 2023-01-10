import { resolve } from 'path'
import { TSESLint } from '@typescript-eslint/utils'
import { RuleTester } from 'eslint'

const DEFAULT_TEST_CASE_CONFIG = {
  filename: 'MyComponent.stories.js',
}

class StorybookRuleTester extends TSESLint.RuleTester {
  run<TMessageIds extends string, TOptions extends Readonly<unknown[]>>(
    ruleName: string,
    rule: TSESLint.RuleModule<TMessageIds, TOptions>,
    tests: TSESLint.RunTests<TMessageIds, TOptions>
  ): void {
    const { valid, invalid } = tests

    const finalValid = valid.map((testCase) => {
      if (typeof testCase === 'string') {
        return {
          ...DEFAULT_TEST_CASE_CONFIG,
          code: testCase,
        }
      }

      return { ...DEFAULT_TEST_CASE_CONFIG, ...testCase }
    })
    const finalInvalid = invalid.map((testCase) => ({
      ...DEFAULT_TEST_CASE_CONFIG,
      ...testCase,
    }))

    super.run(ruleName, rule, { valid: finalValid, invalid: finalInvalid })
  }
}

const createRuleTester = (
  parserOptions: Partial<TSESLint.ParserOptions> = {}
): TSESLint.RuleTester => {
  return new StorybookRuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      ...parserOptions,
    },
  })
}

export const parserOptions = {
  filePath: '__placeholder__.mdx',
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion: 'latest',
  sourceType: 'module',
  tokens: true,
  comment: true,
  // required for @typescript-eslint/parser
  // reference: https://github.com/typescript-eslint/typescript-eslint/pull/2028
  loc: true,
  range: true,
}

export const parser = require.resolve('eslint-mdx')

export const mdxRuleTester = new RuleTester()

export default createRuleTester()
