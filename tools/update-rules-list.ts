import rules from './utils/rules'

import { configBadges, emojiKey, writeRulesListInReadme, updateRulesDocs } from './utils/docs'

/*
This script updates the rules table in `README.md`from rule's meta data.
*/

const createRuleLink = (ruleName: string) =>
  `[\`storybook/${ruleName}\`](./docs/rules/${ruleName}.md)`

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
      rule.name,
      createRuleLink(rule.name),
      rule.meta.docs.description,
      rule.meta.fixable ? emojiKey.fixable : '',
      `<ul>${rule.meta.docs.categories.map((c) => `<li>${c}</li>`).join('')}</ul>`,
    ]
  })

writeRulesListInReadme(rulesList)

updateRulesDocs(rulesList)
