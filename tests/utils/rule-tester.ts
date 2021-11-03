import { RuleTester } from 'eslint'
import parser from '@typescript-eslint/parser'

export default new RuleTester({
  parser,
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 8,
    sourceType: 'module',
  },
})
