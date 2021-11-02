const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const prompts = require('prompts')
const { default: dedent } = require('ts-dedent')

const logger = console

// CLI questions
const questions = [
  {
    type: 'text',
    name: 'authorName',
    message: 'What is your name?',
  },
  {
    type: 'text',
    name: 'ruleId',
    message: dedent(`'What is the rule ID? Follow the ESLint rule naming conventions:

      - If your rule is disallowing something, prefix it with no- such as no-eval for disallowing eval() and no-debugger for disallowing debugger.
      - If your rule is enforcing the inclusion of something, use a short name without a special prefix.
      - Use dashes between words.
    `),
  },
  {
    type: 'text',
    name: 'ruleDescription',
    message: 'Type a short description of this rule',
  },
]

const generateRule = async () => {
  const { authorName, ruleId, ruleDescription } = await prompts(questions)

  const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleId}.js`)
  const testFile = path.resolve(__dirname, `../tests/lib/rules/${ruleId}.js`)
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`)

  logger.log(`creating lib/rules/${ruleId}.js`)
  fs.writeFileSync(
    ruleFile,
    dedent(`/**
       * @fileoverview ${ruleDescription}
       * @author ${authorName}
       */
      'use strict'

      const { docsUrl } = require('../utils')
      const { CATEGORY_ID } = require('../utils/constants')

      //------------------------------------------------------------------------------
      // Rule Definition
      //------------------------------------------------------------------------------

      /**
       * @type {import('eslint').Rule.RuleModule}
       */
      module.exports = {
        meta: {
          type: null, // \`problem\`, \`suggestion\`, or \`layout\`
          docs: {
            description: 'Fill me in',
            // Change the category to the one that suits this rule. If the only category is "recommended", then remove the category field and set recommended to true.
            category: CATEGORY_ID.CSF,
            recommended: false,
            recommendedConfig: 'warn', // or 'error'
            url: docsUrl('${ruleId}'), // URL to the documentation page for this rule
          },
          messages: {
            anyMessageIdHere: 'Fill me in',
          },
          fixable: null, // Or \`code\` or \`whitespace\`
          schema: [], // Add a schema if the rule has options. Otherwise remove this
        },

        create(context) {
          // variables should be defined here

          //----------------------------------------------------------------------
          // Helpers
          //----------------------------------------------------------------------

          // any helper functions should go here or else delete this section

          //----------------------------------------------------------------------
          // Public
          //----------------------------------------------------------------------

          return {
            /**
             * This is an example rule that reports an error in case a named export is called 'wrong'
             * Use https://eslint.org/docs/developer-guide/working-with-rules for Eslint API
             * And check https://astexplorer.net/ to help write rules
             * And delete this entire comment block
             */
            /**
             * @param {import('eslint').Rule.Node} node
             */
            ExportNamedDeclaration: function (node) {
              const identifier = node.declaration.declarations[0].id
              if (identifier) {
                const { name } = identifier
                if (name === 'wrong') {
                  context.report({
                    node,
                    messageId: 'anyMessageIdHere',
                  })
                }
              }
            },
          }
        },
      }\n`)
  )

  logger.log(`creating tests/lib/rules/${ruleId}.js`)
  fs.writeFileSync(
    testFile,
    dedent(`/**
         * @fileoverview ${ruleDescription}
         * @author ${authorName}
         */
        'use strict'

        //------------------------------------------------------------------------------
        // Requirements
        //------------------------------------------------------------------------------

        const rule = require('../../../lib/rules/${ruleId}'),
          ruleTester = require('../../utils/rule-tester')

        //------------------------------------------------------------------------------
        // Tests
        //------------------------------------------------------------------------------

        ruleTester.run('${ruleId}', rule, {
          /**
           * This is an example test for a  rule that reports an error in case a named export is called 'wrong'
           * Use https://eslint.org/docs/developer-guide/working-with-rules for Eslint API
           * And delete this entire comment block
           */
          valid: ['export const Correct'],
          invalid: [
            {
              code: 'export const wrong',
              errors: [
                {
                  messageId: 'anyMessageIdHere', // comes from the rule file
                },
              ],
            },
          ],
        })\n`)
  )

  logger.log(`creating docs/rules/${ruleId}.md`)
  fs.writeFileSync(
    docFile,
    dedent(`
      # ${ruleId}

      Please describe the origin of the rule here.

      <!-- RULE-CATEGORIES:START -->
      <!-- RULE-LIST:END -->

      ## Rule Details

      ${ruleDescription}.
      This rule aims to...

      Examples of **incorrect** code for this rule:

      \`\`\`js

      // fill me in

      \`\`\`

      Examples of **correct** code for this rule:

      \`\`\`js

      // fill me in

      \`\`\`

      ### Options

      If there are any options, describe them here. Otherwise, delete this section.

      ## When Not To Use It

      Give a short description of when it would be appropriate to turn off this rule. If not applicable, delete this section.

      ## Further Reading

      If there are other links that describe the issue this rule addresses, please include them here in a bulleted list. Otherwise, delete this section.
    `)
  )

  const { shouldOpenInVSCode } = await prompts({
    type: 'confirm',
    name: 'shouldOpenInVSCode',
    message: 'Do you want to open the newly generated files in VS Code?',
    initial: false,
  })

  if (shouldOpenInVSCode) {
    cp.execSync(`code "${ruleFile}"`)
    cp.execSync(`code "${testFile}"`)
    cp.execSync(`code "${docFile}"`)
  }

  logger.log('🚀 All done! Make sure to run yarn test as you write the rule.')
  logger.log('❤️ Thanks for helping this plugin get better!')
}

generateRule()
