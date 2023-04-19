import rules, { TRules } from './rules'
import { CategoryId } from '../../lib/utils/constants'

type TCategoriesConfig = Record<string, { text: string; rules?: TRules }>

const categoriesConfig: TCategoriesConfig = {
  [CategoryId.CSF]: {
    text: 'CSF Rules',
  },
  [CategoryId.CSF_STRICT]: {
    text: 'Strict CSF Rules',
  },
  [CategoryId.ADDON_INTERACTIONS]: {
    text: 'Rules for writing interactions in Storybook',
  },
  [CategoryId.RECOMMENDED]: {
    text: 'Base rules recommended by Storybook',
  },
}

export const categoryIds = Object.keys(categoriesConfig) as CategoryId[]

for (const categoryId of categoryIds) {
  categoriesConfig[categoryId].rules = []

  for (const rule of rules) {
    const ruleCategories = rule.meta.docs.categories

    if (ruleCategories?.includes(categoryId)) {
      categoriesConfig[categoryId].rules?.push(rule)
    }
  }
}

export const categories = categoryIds
  .map((categoryId) => {
    if (!categoriesConfig[categoryId].rules?.length) {
      throw new Error(
        `Category "${categoryId}" has no rules. Make sure that at least one rule is linked to this category.`
      )
    }

    return {
      categoryId,
      title: categoriesConfig[categoryId],
      rules: categoriesConfig[categoryId].rules?.filter((rule) => !rule.meta.deprecated) ?? [],
    }
  })
  .filter((category) => {
    return (category.rules?.length ?? 0) >= 1
  })

export type TCategory = typeof categories extends (infer TCat)[] ? TCat : never
