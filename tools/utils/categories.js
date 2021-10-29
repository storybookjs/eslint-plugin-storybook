'use strict'

const rules = require('./rules')

const categoriesConfig = {
  csf: {
    text: 'CSF Rules',
  },
  'csf-strict': {
    text: 'Strict CSF Rules',
  },
  'addon-interactions': {
    text: 'Rules for writing interactions in Storybook',
  },
  recommended: {
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
