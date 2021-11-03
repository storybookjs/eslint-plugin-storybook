/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unsupported-features/es-syntax */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rules'.
const rules = require('./utils/rules')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'configBadg... Remove this comment to see the full error message
const { configBadges, emojiKey, writeRulesList } = require('./utils/docs')

/*
This script updates the rules table in `README.md`from rule's meta data.
*/

const createRuleLink = (ruleName: any) => `[\`storybook/${ruleName}\`](./docs/rules/${ruleName}.md)`

// @ts-expect-error ts-migrate(2550) FIXME: Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
const generateConfigBadges = (recommendedConfig: any) => Object.entries(recommendedConfig)
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element '_' implicitly has an 'any' type.
  .filter(([_, config]) => Boolean(config))
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'framework' implicitly has an 'any... Remove this comment to see the full error message
  .map(([framework]) => configBadges[framework])
  .join(' ')

// @ts-expect-error ts-migrate(2550) FIXME: Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
const rulesList = Object.entries(rules)
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element '_' implicitly has an 'any' type.
  .sort(([_, { name: ruleNameA }], [__, { name: ruleNameB }]) => {
    return ruleNameA.localeCompare(ruleNameB)
  })
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element '_' implicitly has an 'any' type.
  .map(([_, rule]) => {
    return [
      createRuleLink(rule.name),
      rule.meta.docs.description,
      rule.meta.fixable ? emojiKey.fixable : '',
      rule.meta.docs.categories.join(', '),
    ]
  })

writeRulesList(rulesList)
