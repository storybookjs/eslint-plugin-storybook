'use strict'

/*
This script updates `lib/configs/*.js` files from rule's meta data.
*/

const fs = require('fs')
const path = require('path')
const { format } = require('prettier');
const categories = require('./utils/categories')

const extendsCategories = {
  csf: null,
  'csf-strict': 'csf',
}

const externalRuleOverrides = {
  "import/no-anonymous-default-export": "off"
}

function formatRules(rules) {
  const obj = rules.reduce((setting, rule) => {
    setting[rule.ruleId] = rule.meta.docs.recommendedConfig || 'error'
    return setting
  }, externalRuleOverrides)
  return JSON.stringify(obj, null, 2)
}

function formatCategory(category) {
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

const ROOT = path.resolve(__dirname, '../lib/configs/')

// cleanup folder
fs.rmdirSync(ROOT, { recursive: true })
fs.mkdirSync(ROOT)

// Update/add rule files
categories.forEach((category) => {
  const filePath = path.join(ROOT, `${category.categoryId}.js`)
  const content = format(formatCategory(category), { parser: 'babel' })

  fs.writeFileSync(filePath, content)
})