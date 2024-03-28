import { categories, TCategory } from './categories'

export const extendsCategories = {
  csf: null,
  recommended: null,
  'csf-strict': 'csf',
}

const externalRuleOverrides = {
  'react-hooks/rules-of-hooks': 'off',
  'import/no-anonymous-default-export': 'off',
}

export function formatRules(rules: TCategory['rules'], exclude?: string[]) {
  const obj = rules.reduce(
    (setting, rule) => {
      if (!exclude?.includes(rule.ruleId)) {
        setting[rule.ruleId] = rule.meta.docs.recommended || 'error'
      }
      return setting
    },
    { ...externalRuleOverrides }
  )

  return JSON.stringify(obj, null, 2)
}

export function formatSingleRule(rules: TCategory['rules'], ruleId: string) {
  const ruleOpt = rules.find((rule) => rule.ruleId === ruleId)?.meta.docs.recommended || 'error'

  return JSON.stringify({ [ruleId]: ruleOpt }, null, 2)
}

export const SUPPORTED_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs']
export const STORIES_GLOBS = [
  `'*.stories.@(${SUPPORTED_EXTENSIONS.join('|')})'`,
  `'*.story.@(${SUPPORTED_EXTENSIONS.join('|')})'`,
]

// Other files that will be linted
export const MAIN_JS_FILE = [`'.storybook/main.@(js|cjs|mjs|ts)'`]
