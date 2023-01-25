/**
 * @fileoverview Use string literals to override a story name
 * @author Charles Gruenais
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/use-string-literal-names'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{ messageId: 'useStringLiteralName' }] as const

ruleTester.run('use-string-literal-names', rule, {
  valid: [
    'export const A = { name: "N" }',
    "export const A = { name: 'N' }",
    "const ABase = { parameters: {} }; export const A = { ...ABase, name: 'N' }",
    'const A = { name: "N" }; export { A }',
    "const A = { name: 'N' }; export { A }",
    'const A = { name }', // Not a Story (not exported)
    'const name = String(1994); export const A = { args: { name } }',
    'export const A = { args: { name: String(1994) } }',
    'export const A = { play: async () => { const name = String(1994) } }',
    'export const A = () => {}; A.name = "N"',
    'export const A = () => {}; A.storyName = "N"',
  ],
  invalid: [
    { code: 'export const A = { name: "1994" + "definitely not my credit card PIN" }', errors },
    { code: 'export const A = { name: `N` }', errors },
    { code: 'export const A = { name: String(1994) }', errors },
    { code: 'const name = "N"; export const A = { name }', errors },
    { code: 'const A = { name: `N` }; export { A }', errors },
    { code: 'const A = { name: String(1994) }; export { A }', errors },
    { code: 'const name = "N"; const A = { name }; export { A }', errors },
    { code: 'export const A = () => {}; A.name = String(1994)', errors },
    { code: 'export const A = () => {}; A.storyName = String(1994)', errors },
    // Not sure how often this actually happens. If too complex, don't take care of it and delete this test
    {
      code: 'const ABase = { name: String(1994) }; export const A = { ...ABase, parameters: {} }',
      errors,
    },
  ],
})
