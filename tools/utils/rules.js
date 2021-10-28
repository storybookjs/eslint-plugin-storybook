'use strict'

const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '../../lib/rules')

module.exports = fs
  .readdirSync(ROOT)
  .filter((file) => path.extname(file) === '.js')
  .map((file) => path.basename(file, '.js'))
  .map((name) => {
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
