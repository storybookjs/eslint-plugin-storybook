'use strict'

const rules = require('./rules')

const categories = {
  csf: {
    text: 'CSF Rules',
  },
  'csf-strict': {
    text: 'Strict CSF Rules',
  },
  recommended: {
    text: 'Base rules recommended by Storybook',
  },
}

const categoryIds = Object.keys(categories)

for (const categoryId of categoryIds) {
  categories[categoryId].rules = []

  for (const rule of rules) {
    const ruleCategories = rule.meta.docs.categories
    // Throw if rule does not have a category
    if (!ruleCategories.length) {
      throw new Error(`Rule "${rule.ruleId}" does not have any category.`)
    }

    if (ruleCategories.includes(categoryId)) {
      categories[categoryId].rules.push(rule)
    }
  }
}

module.exports = categoryIds
  .map((categoryId) => {
    return {
      categoryId,
      title: categories[categoryId],
      rules: (categories[categoryId].rules || []).filter((rule) => !rule.meta.deprecated),
    }
  })
  .filter((category) => {
    return category.rules.length >= 1
  })
