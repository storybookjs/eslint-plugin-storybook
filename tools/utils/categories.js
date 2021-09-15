'use strict'

const rules = require('./rules')

const categoryTitles = {
  csf: {
    text: 'CSF Rules',
  },
  'csf-strict': {
    text: 'Strict CSF Rules',
  },
}

const categoryIds = Object.keys(categoryTitles)
const categoryRules = {}

for (const rule of rules) {
  const categories = rule.meta.docs.categories || ['uncategorized']
  for (const categoryId of categories) {
    // Throw if no title is defined for a category
    if (categoryId !== 'uncategorized' && !categoryTitles[categoryId]) {
      throw new Error(`Category "${categoryId}" does not have a title defined.`)
    }
    const catRules =
      categoryRules[categoryId] || (categoryRules[categoryId] = [])
    catRules.push(rule)
  }
}

module.exports = categoryIds
  .map((categoryId) => ({
    categoryId,
    title: categoryTitles[categoryId],
    rules: (categoryRules[categoryId] || []).filter(
      (rule) => !rule.meta.deprecated
    )
  }))
  .filter((category) => category.rules.length >= 1)