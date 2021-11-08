import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../../lib/rules')

const rules = fs
  .readdirSync(ROOT)
  .filter((file) => path.extname(file) === '.ts')
  .map((file) => path.basename(file, '.ts'))
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
  // We might have rules which are almost ready but should not be shipped
  .filter((rule: any) => !rule.meta.docs.excludeFromConfig)

export default rules
