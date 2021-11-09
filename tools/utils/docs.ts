import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { format, resolveConfig } from 'prettier'

import { categoryIds } from './categories'

const prettierConfig = resolveConfig.sync(__dirname)
const readmePath = resolve(__dirname, `../../README.md`)
const ruleDocsPath = resolve(__dirname, `../../docs/rules`)

export const configBadges = categoryIds.reduce(
  (badges, category) => ({
    ...badges,
    // in case we ever want to add nice looking badges. Not in use at the moment
    [category]: `![${category}-badge][]`,
  }),
  {}
)

export const emojiKey = {
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

const generateRulesListTable = (rulesList: any) =>
  [staticElements.listHeaderRow, staticElements.listSpacerRow, ...rulesList]
    .map((column) => `|${column.join('|')}|`)
    .join('\n')

const generateRulesListMarkdown = (rulesList: any) =>
  ['', staticElements.rulesListKey, '', generateRulesListTable(rulesList), ''].join('\n')

const listBeginMarker = '<!-- RULES-LIST:START -->'
const listEndMarker = '<!-- RULES-LIST:END -->'
const overWriteRulesList = (rulesList: any, readme: string) => {
  const listStartIndex = readme.indexOf(listBeginMarker)
  const listEndIndex = readme.indexOf(listEndMarker)

  if ([listStartIndex, listEndIndex].includes(-1)) {
    throw new Error(`cannot find start or end rules-list`)
  }

  console.log(rulesList)
  return [
    readme.substring(0, listStartIndex - 1),
    listBeginMarker,
    '',
    generateRulesListMarkdown(rulesList),
    readme.substring(listEndIndex),
  ].join('\n')
}

const ruleCategoriesBeginMarker = '<!-- RULE-CATEGORIES:START -->'
const ruleCategoriesEndMarker = '<!-- RULE-CATEGORIES:END -->'
const overWriteRuleDocs = (rule: any, ruleDocFile: string) => {
  const ruleCategoriesStartIndex = ruleDocFile.indexOf(ruleCategoriesBeginMarker)
  const ruleCategoriesEndIndex = ruleDocFile.indexOf(ruleCategoriesEndMarker)

  if ([ruleCategoriesStartIndex, ruleCategoriesEndIndex].includes(-1)) {
    throw new Error(`cannot find start or end rules-categories`)
  }

  return [
    ruleDocFile.substring(0, ruleCategoriesStartIndex - 1),
    ruleCategoriesBeginMarker,
    '',
    `**Categories**: ${rule[4]}`,
    ruleDocFile.substring(ruleCategoriesEndIndex),
  ].join('\n')
}

export const writeRulesListInReadme = (rulesList: any) => {
  const readme = readFileSync(readmePath, 'utf8')
  const rulesListWithoutName = rulesList.map((rule) => rule.slice(1))
  const newReadme = format(overWriteRulesList(rulesListWithoutName, readme), {
    parser: 'markdown',
    ...prettierConfig,
  })

  writeFileSync(readmePath, newReadme)
}

export const updateRulesDocs = (rulesList: any) => {
  rulesList.forEach((rule) => {
    const ruleName = rule[0]
    const ruleDocFilePath = resolve(ruleDocsPath, `${ruleName}.md`)
    const ruleDocFile = readFileSync(ruleDocFilePath, 'utf8')

    const updatedDocFile = format(overWriteRuleDocs(rule, ruleDocFile), {
      parser: 'markdown',
      ...prettierConfig,
    })

    writeFileSync(ruleDocFilePath, updatedDocFile)
  })
}
