import rules from './utils/rules'

import { configBadges, emojiKey, writeRulesList } from './utils/docs'

/*
This script updates the rules table in `README.md`from rule's meta data.
*/

const createRuleLink = (ruleName: any) => `[\`storybook/${ruleName}\`](./docs/rules/${ruleName}.md)`

const generateConfigBadges = (recommendedConfig: any) =>
  Object.entries(recommendedConfig)
    .filter(([_, config]) => Boolean(config))
    .map(([framework]) => configBadges[framework])
    .join(' ')

const rulesList = Object.entries(rules)
  .sort(([_, { name: ruleNameA }], [__, { name: ruleNameB }]) => {
    return ruleNameA.localeCompare(ruleNameB)
  })
  .map(([_, rule]) => {
    return [
      createRuleLink(rule.name),
      rule.meta.docs.description,
      rule.meta.fixable ? emojiKey.fixable : '',
      rule.meta.docs.categories.join(', '),
    ]
  })

writeRulesList(rulesList)
