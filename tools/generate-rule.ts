import path from 'path'

import fs from 'fs'
import cp from 'child_process'
import prompts from 'prompts'
import dedent from 'ts-dedent'

const logger = console

// CLI questions
const questions = [
  {
    type: 'text',
    name: 'authorName',
    initial: '',
    message: 'What is your name?',
    validate: (name: any) => (name === '' ? "Name can't be empty" : true),
  },
  {
    type: 'text',
    name: 'ruleId',
    message: dedent(`'What is the rule ID? Follow the ESLint rule naming conventions:

      - If your rule is disallowing something, prefix it with no- such as no-eval for disallowing eval() and no-debugger for disallowing debugger.
      - If your rule is enforcing the inclusion of something, use a short name without a special prefix.
      - Use dashes between words.
    `),
    validate: (rule: any) => (rule === '' ? "Rule can't be empty" : true),
  },
  {
    type: 'text',
    name: 'ruleDescription',
    message: 'Type a short description of this rule',
    validate: (rule: any) => (rule === '' ? "Description can't be empty" : true),
  },
]

const generateRule = async () => {
  const { authorName, ruleId, ruleDescription } = await prompts(questions)

  if (!authorName) {
    logger.log('Process canceled by the user.')
    process.exit(0)
  }

  const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleId}.ts`)
  const testFile = path.resolve(__dirname, `../tests/lib/rules/${ruleId}.ts`)
  const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`)

  logger.log(`creating lib/rules/${ruleId}.ts`)
  fs.writeFileSync(
    ruleFile,
    dedent(`/**
       * @fileoverview ${ruleDescription}
       * @author ${authorName}
       */

      import { createStorybookRule } from '../utils/create-storybook-rule'
      import { CategoryId } from '../utils/constants'

      //------------------------------------------------------------------------------
      // Rule Definition
      //------------------------------------------------------------------------------

      export = createStorybookRule({
        name: '${ruleId}',
        defaultOptions: [],
        meta: {
          type: null, // \`problem\`, \`suggestion\`, or \`layout\`
          docs: {
            description: 'Fill me in',
            // Add the categories that suit this rule.
            categories: [CategoryId.RECOMMENDED],
            recommended: 'warn', // or 'error'
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
      })\n`)
  )

  logger.log(`creating tests/lib/rules/${ruleId}.ts`)
  fs.writeFileSync(
    testFile,
    dedent(`/**
         * @fileoverview ${ruleDescription}
         * @author ${authorName}
         */

        //------------------------------------------------------------------------------
        // Requirements
        //------------------------------------------------------------------------------

        import rule from '../../../lib/rules/${ruleId}'
        import ruleTester from '../../utils/rule-tester'

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

  logger.log('\n🚀 All done! Make sure to run yarn test as you write the rule.')
  logger.log('❤️  Thanks for helping this plugin get better!')
}

generateRule()
