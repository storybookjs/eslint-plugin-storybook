'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path')
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ROOT'.
const ROOT = path.resolve(__dirname, '../../lib/rules')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = fs
  .readdirSync(ROOT)
  .filter((file: any) => path.extname(file) === '.js')
  .map((file: any) => path.basename(file, '.js'))
  .map((name: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const meta = { ...require(path.join(ROOT, name)).meta }
    if (meta.docs && !meta.docs.categories) {
      meta.docs = { ...meta.docs }
      meta.docs.categories = []

      if (meta.docs.category) {
        meta.docs.categories.push(meta.docs.category)
        delete meta.docs.category
      }

      if (meta.docs.recommended) {
        meta.docs.categories.push('recommended')
      }
    }
    return {
      ruleId: `storybook/${name}`,
      name,
      meta,
    }
  })
  // We might have rules which are almost ready but should not be shipped
  .filter((rule: any) => !rule.meta.docs.excludeFromConfig)
