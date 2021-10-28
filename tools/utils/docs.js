const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { format, resolveConfig } = require('prettier')

const prettierConfig = resolveConfig.sync(__dirname)
const readmePath = resolve(__dirname, `../../README.md`)

const CONFIGURATIONS = ['csf', 'csf-strict', 'recommended']

const configBadges = CONFIGURATIONS.reduce(
  (badges, framework) => ({
    ...badges,
    [framework]: `![${framework}-badge][]`,
  }),
  {}
)

const emojiKey = {
  fixable: '🔧',
}

const staticElements = {
  listHeaderRow: ['Name', 'Description', emojiKey.fixable, 'Included in configurations'],
  listSpacerRow: Array(4).fill('-'),
  rulesListKey: [
    `**Key**: ${emojiKey.fixable} = fixable`,
    '',
    [
      `**Configurations**:`,
      Object.entries(configBadges)
        .map(([template]) => template)
        .join(', '),
    ].join(' '),
  ].join('\n'),
}

const generateRulesListTable = (rulesList) =>
  [staticElements.listHeaderRow, staticElements.listSpacerRow, ...rulesList]
    .map((column) => `|${column.join('|')}|`)
    .join('\n')

const generateRulesListMarkdown = (rulesList) =>
  ['', staticElements.rulesListKey, '', generateRulesListTable(rulesList), ''].join('\n')

const listBeginMarker = '<!-- RULES-LIST:START -->'
const listEndMarker = '<!-- RULES-LIST:END -->'
const overWriteRulesList = (rulesList, readme) => {
  const listStartIndex = readme.indexOf(listBeginMarker)
  const listEndIndex = readme.indexOf(listEndMarker)

  if ([listStartIndex, listEndIndex].includes(-1)) {
    throw new Error(`cannot find start or end rules-list`)
  }

  return [
    readme.substring(0, listStartIndex - 1),
    listBeginMarker,
    '',
    generateRulesListMarkdown(rulesList),
    readme.substring(listEndIndex),
  ].join('\n')
}

const writeRulesList = (rulesList) => {
  const readme = readFileSync(readmePath, 'utf8')
  const newReadme = format(overWriteRulesList(rulesList, readme), {
    parser: 'markdown',
    ...prettierConfig,
  })

  writeFileSync(readmePath, newReadme)
}

module.exports = {
  configBadges,
  writeRulesList,
  emojiKey,
}
