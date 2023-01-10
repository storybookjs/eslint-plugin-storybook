import path from 'node:path'

import type { ParserOptions } from 'eslint-mdx'
import {
  DEFAULT_EXTENSIONS,
  MARKDOWN_EXTENSIONS,
  getPhysicalFilename,
  performSyncWork,
} from 'eslint-mdx'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'

export = createStorybookRule({
  //@ts-ignore
  meta: {
    type: 'problem',
    docs: {
      description: 'Meta should only have inline properties',
      categories: [CategoryId.CSF, CategoryId.RECOMMENDED],
      excludeFromConfig: true,
      recommended: 'error',
    },
    fixable: 'code',
    // messages: {
    //   hey: 'DJ'
    // },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename()
    const extname = path.extname(filename)
    const sourceCode = context.getSourceCode()
    const options = context.parserOptions as ParserOptions
    const isMdx = [...DEFAULT_EXTENSIONS, ...(options.extensions || [])].includes(extname)
    return {
      // eslint-disable-next-line sonarjs/cognitive-complexity
      Program(node) {
        /* istanbul ignore if */
        if (!isMdx) {
          console.log('NOT AN MDX FILE!')
          return
        }

        const ignoreRemarkConfig = Boolean(options.ignoreRemarkConfig)

        const physicalFilename = getPhysicalFilename(filename)

        const sourceText = sourceCode.getText(node)

        console.log({ ignoreRemarkConfig, physicalFilename, sourceText })

        return
        // const { messages, content: fixedText } = performSyncWork({
        //   fileOptions: {
        //     path: physicalFilename,
        //     value: sourceText,
        //     cwd: context.getCwd?.(),
        //   },
        //   physicalFilename,
        //   isMdx,
        //   process: true,
        //   ignoreRemarkConfig,
        // })

        // let fixed = 0

        // for (const {
        //   source,
        //   reason,
        //   ruleId,
        //   fatal,
        //   line,
        //   column,
        //   position: { start, end },
        // } of messages) {
        //   // https://github.com/remarkjs/remark-lint/issues/65#issuecomment-220800231
        //   /* istanbul ignore next */
        //   const severity = fatal ? 2 : fatal == null ? 0 : 1
        //   /* istanbul ignore if */
        //   if (!severity) {
        //     // should never happen, just for robustness
        //     continue
        //   }

        //   const message = {
        //     reason,
        //     source,
        //     ruleId,
        //     severity,
        //   }
        //   context.report({
        //     // related to https://github.com/eslint/eslint/issues/14198
        //     message: JSON.stringify(message),
        //     loc: {
        //       line,
        //       // ! eslint ast column is 0-indexed, but unified is 1-indexed
        //       column: column - 1,
        //       start: {
        //         ...start,
        //         column: start.column - 1,
        //       },
        //       end: {
        //         ...end,
        //         column: end.column - 1,
        //       },
        //     },
        //     node,
        //     fix:
        //       fixedText === sourceText
        //         ? null
        //         : () =>
        //             fixed++
        //               ? null
        //               : {
        //                   range: [0, sourceText.length],
        //                   text: fixedText,
        //                 },
        //   })
        // }
      },
    }
  },
})
