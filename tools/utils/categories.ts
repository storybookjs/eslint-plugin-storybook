'use strict'

const rules = require('./rules')
const { CATEGORY_ID } = require('../../lib/utils/constants')

const categoriesConfig = {
  [CATEGORY_ID.CSF]: {
    text: 'CSF Rules',
  },
  [CATEGORY_ID.CSF_STRICT]: {
    text: 'Strict CSF Rules',
  },
  [CATEGORY_ID.ADDON_INTERACTIONS]: {
    text: 'Rules for writing interactions in Storybook',
  },
  [CATEGORY_ID.RECOMMENDED]: {
    text: 'Base rules recommended by Storybook',
  },
}

const categoryIds = Object.keys(categoriesConfig)

for (const categoryId of categoryIds) {
  categoriesConfig[categoryId].rules = []

  for (const rule of rules) {
    const ruleCategories = rule.meta.docs.categories
    // Throw if rule does not have a category
    if (!ruleCategories.length) {
      throw new Error(`Rule "${rule.ruleId}" does not have any category.`)
    }

    if (ruleCategories.includes(categoryId)) {
      categoriesConfig[categoryId].rules.push(rule)
    }
  }
}

const categories = categoryIds
  .map((categoryId) => {
    if (!categoriesConfig[categoryId].rules.length) {
      throw new Error(
        `Category "${categoryId}" has no rules. Make sure that at least one rule is linked to this category.`
      )
    }

    return {
      categoryId,
      title: categoriesConfig[categoryId],
      rules: categoriesConfig[categoryId].rules.filter((rule) => !rule.meta.deprecated),
    }
  })
  .filter((category) => {
    return category.rules.length >= 1
  })

module.exports = {
  categories,
  categoryIds,
}
