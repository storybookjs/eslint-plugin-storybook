import rules from './rules'
import { CATEGORY_ID } from '../../lib/utils/constants'

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

export const categoryIds = Object.keys(categoriesConfig)

for (const categoryId of categoryIds) {
  // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
  categoriesConfig[categoryId].rules = []

  for (const rule of rules) {
    const ruleCategories = rule.meta.docs.categories
    // Throw if rule does not have a category
    if (!ruleCategories.length) {
      throw new Error(`Rule "${rule.ruleId}" does not have any category.`)
    }

    if (ruleCategories.includes(categoryId)) {
      // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
      categoriesConfig[categoryId].rules.push(rule)
    }
  }
}

export const categories = categoryIds
  .map((categoryId) => {
    // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
    if (!categoriesConfig[categoryId].rules.length) {
      throw new Error(
        `Category "${categoryId}" has no rules. Make sure that at least one rule is linked to this category.`
      )
    }

    return {
      categoryId,
      title: categoriesConfig[categoryId],
      // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
      rules: categoriesConfig[categoryId].rules.filter((rule: any) => !rule.meta.deprecated),
    }
  })
  .filter((category) => {
    return category.rules.length >= 1
  })
