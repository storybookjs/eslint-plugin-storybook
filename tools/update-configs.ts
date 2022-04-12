/*
This script updates `lib/configs/*.js` files from rule's meta data.
*/

import fs from 'fs'
import path from 'path'
import { format, Options } from 'prettier'
import prettierConfig from '../.prettierrc'

import { categories, TCategory } from './utils/categories'

const extendsCategories = {
  csf: null,
  recommended: null,
  'csf-strict': 'csf',
}

const externalRuleOverrides = {
  'import/no-anonymous-default-export': 'off',
}

function formatRules(rules: TCategory['rules']) {
  const obj = rules.reduce(
    (setting, rule) => {
      setting[rule.ruleId] = rule.meta.docs.recommended || 'error'
      return setting
    },
    { ...externalRuleOverrides }
  )

  return JSON.stringify(obj, null, 2)
}

const SUPPORTED_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs']
const STORIES_GLOBS = [
  `'*.stories.@(${SUPPORTED_EXTENSIONS.join('|')})'`,
  `'*.story.@(${SUPPORTED_EXTENSIONS.join('|')})'`,
]

function formatCategory(category: TCategory) {
  const extendsCategoryId = extendsCategories[category.categoryId]
  if (extendsCategoryId == null) {
    return `/*
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
        }]
      }
    `
  }
  return `/*
    * IMPORTANT!
    * This file has been automatically generated,
    * in order to update it's content execute "yarn update-all"
    */
    export = {
      extends: require.resolve('./${extendsCategoryId}'),
      rules: ${formatRules(category.rules)}
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
    ...prettierConfig as Options,
  })

  fs.writeFileSync(filePath, content)
})
