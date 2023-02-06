/*
This script updates `lib/configs/*.js` files from rule's meta data.
*/

import fs from 'fs'
import path from 'path'
import { format, Options } from 'prettier'
import dedent from 'ts-dedent'
import prettierConfig from '../.prettierrc'

import { categories, TCategory } from './utils/categories'

const extendsCategories = {
  recommended: null,
  csf: 'recommended',
  'csf-strict': 'csf',
  'addon-interactions': 'recommended',
}

const externalRuleOverrides = {
  'import/no-anonymous-default-export': 'off',
}

function formatRules(rules: TCategory['rules']) {
  const obj = rules.reduce(
    (setting, rule) => {
      // We filter main.js rules and only pass rules for stories files
      if (!rule.meta.docs.isMainConfigRule) {
        setting[rule.ruleId] = rule.meta.docs.recommended || 'error'
      }
      return setting
    },
    { ...externalRuleOverrides }
  )

  return JSON.stringify(obj, null, 2)
}

function formatMainConfigRules(rules: TCategory['rules']) {
  const final = rules.reduce((setting, rule) => {
    if (rule.meta.docs.isMainConfigRule) {
      setting[rule.ruleId] = rule.meta.docs.recommended || 'error'
    }
    return setting
  }, {})

  return JSON.stringify(final, null, 2)
}

const SUPPORTED_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs']
const STORIES_GLOBS = [
  `'*.stories.@(${SUPPORTED_EXTENSIONS.join('|')})'`,
  `'*.story.@(${SUPPORTED_EXTENSIONS.join('|')})'`,
]

// Other files that will be linted
const MAIN_JS_FILE = [`'.storybook/main.@(js|cjs|mjs|ts)'`]

function formatCategory(category: TCategory) {
  const extendsCategoryId = extendsCategories[category.categoryId]

  // For the root category (recommended), we don't extend anything
  if (extendsCategoryId == null) {
    return dedent`/*
      * IMPORTANT!
      * This file has been automatically generated,
      * in order to update it's content execute "yarn update-all"
      */
      export = {
        plugins: [
          'storybook'
        ],
        overrides: [{
          files: [${STORIES_GLOBS.join(', ')}],
          rules: ${formatRules(category.rules)}
        },{
          files: [${MAIN_JS_FILE.join(', ')}],
          rules: ${formatMainConfigRules(category.rules)}
        }],
      }
    `
  }

  const getMainConfigOverrides = (rules: TCategory['rules']) => {
    const hasMainConfigRules = rules.filter((rule) => rule.meta.docs.isMainConfigRule).length > 0

    if (hasMainConfigRules) {
      return `
      overrides: [{
        files: [${MAIN_JS_FILE.join(', ')}],
        rules: ${formatMainConfigRules(rules)}
      }]
      `
    }

    return ''
  }

  // For any other category that extends `recommended`
  return dedent`/*
    * IMPORTANT!
    * This file has been automatically generated,
    * in order to update it's content execute "yarn update-all"
    */
    export = {
      extends: require.resolve('./${extendsCategoryId}'),
      rules: ${formatRules(category.rules)},
      ${getMainConfigOverrides(category.rules)}
    }
  `
}

const ROOT = path.resolve(__dirname, '../lib/configs/')

// cleanup folder
fs.rmdirSync(ROOT, { recursive: true })
fs.mkdirSync(ROOT)

// Update/add rule files
categories.forEach((category) => {
  const filePath = path.join(ROOT, `${category.categoryId}.ts`)
  const content = format(formatCategory(category), {
    parser: 'typescript',
    ...(prettierConfig as Options),
  })

  fs.writeFileSync(filePath, content)
})
