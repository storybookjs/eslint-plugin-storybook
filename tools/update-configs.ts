'use strict'

/*
This script updates `lib/configs/*.js` files from rule's meta data.
*/

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'format'.
const { format } = require('prettier')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prettierCo... Remove this comment to see the full error message
const prettierConfig = require('../.prettierrc')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const { categories } = require('./utils/categories')

const extendsCategories = {
  csf: null,
  recommended: null,
  'csf-strict': 'csf',
}

const externalRuleOverrides = {
  'import/no-anonymous-default-export': 'off',
}

function formatRules(rules: any) {
  const obj = rules.reduce(
    (setting: any, rule: any) => {
      setting[rule.ruleId] = rule.meta.docs.recommendedConfig || 'error'
      return setting
    },
    { ...externalRuleOverrides }
  )

  return JSON.stringify(obj, null, 2)
}

function formatCategory(category: any) {
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const extendsCategoryId = extendsCategories[category.categoryId]
  if (extendsCategoryId == null) {
    return `/*
      * IMPORTANT!
      * This file has been automatically generated,
      * in order to update it's content execute "yarn update-all"
      */
      module.exports = {
        plugins: [
          'storybook'
        ],
        rules: ${formatRules(category.rules)}
      }
    `
  }
  return `/*
    * IMPORTANT!
    * This file has been automatically generated,
    * in order to update it's content execute "yarn update-all"
    */
    module.exports = {
      extends: require.resolve('./${extendsCategoryId}'),
      rules: ${formatRules(category.rules)}
    }
  `
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ROOT'.
const ROOT = path.resolve(__dirname, '../lib/configs/')

// cleanup folder
fs.rmdirSync(ROOT, { recursive: true })
fs.mkdirSync(ROOT)

// Update/add rule files
categories.forEach((category) => {
  const filePath = path.join(ROOT, `${category.categoryId}.js`)
  const content = format(formatCategory(category), { parser: 'babel', ...prettierConfig })

  fs.writeFileSync(filePath, content)
})
