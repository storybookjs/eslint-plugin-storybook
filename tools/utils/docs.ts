// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { readFileSync, writeFileSync } = require('fs')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { resolve } = require('path')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'format'.
const { format, resolveConfig } = require('prettier')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'categoryId... Remove this comment to see the full error message
const { categoryIds } = require('./categories')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prettierCo... Remove this comment to see the full error message
const prettierConfig = resolveConfig.sync(__dirname)
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
const readmePath = resolve(__dirname, `../../README.md`)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'configBadg... Remove this comment to see the full error message
const configBadges = categoryIds.reduce(
  (badges, category) => ({
    ...badges,
    // in case we ever want to add nice looking badges. Not in use at the moment
    [category]: `![${category}-badge][]`,
  }),
  {}
)

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'emojiKey'.
const emojiKey = {
  fixable: '🔧',
}

const staticElements = {
  listHeaderRow: ['Name', 'Description', emojiKey.fixable, 'Included in configurations'],
  // @ts-expect-error ts-migrate(2550) FIXME: Property 'fill' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
  listSpacerRow: Array(4).fill('-'),
  rulesListKey: [
    `**Key**: ${emojiKey.fixable} = fixable`,
    '',
    [
      `**Configurations**:`,
      // @ts-expect-error ts-migrate(2550) FIXME: Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
      Object.entries(configBadges)
        // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'template' implicitly has an 'any'... Remove this comment to see the full error message
        .map(([template]) => template)
        .join(', '),
    ].join(' '),
  ].join('\n'),
}

const generateRulesListTable = (rulesList: any) => [staticElements.listHeaderRow, staticElements.listSpacerRow, ...rulesList]
  .map((column) => `|${column.join('|')}|`)
  .join('\n')

const generateRulesListMarkdown = (rulesList: any) => ['', staticElements.rulesListKey, '', generateRulesListTable(rulesList), ''].join('\n')

const listBeginMarker = '<!-- RULES-LIST:START -->'
const listEndMarker = '<!-- RULES-LIST:END -->'
const overWriteRulesList = (rulesList: any, readme: any) => {
  const listStartIndex = readme.indexOf(listBeginMarker)
  const listEndIndex = readme.indexOf(listEndMarker)

  // @ts-expect-error ts-migrate(2550) FIXME: Property 'includes' does not exist on type 'any[]'... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'writeRules... Remove this comment to see the full error message
const writeRulesList = (rulesList: any) => {
  const readme = readFileSync(readmePath, 'utf8')
  const newReadme = format(overWriteRulesList(rulesList, readme), {
    parser: 'markdown',
    ...prettierConfig,
  })

  writeFileSync(readmePath, newReadme)
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  configBadges,
  writeRulesList,
  emojiKey,
}
