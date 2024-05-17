# use-string-literal-names

<!-- RULE-CATEGORIES:START -->

**Included in these configurations**: <ul><li>recommended</li></ul>

<!-- RULE-CATEGORIES:END -->

## Rule Details

When indexing stories extracted from CSF files, Storybook automatically titles them [based on the named export](https://storybook.js.org/docs/react/api/csf#named-story-exports). Story names can be overridden by setting the `name` property:

```js
export const Simple = {
  decorators: [...],
  parameters: {...},
  // Displays "So Simple" instead of "Simple" in Storybook's sidebar
  name: 'So simple!',
}
```

One can be tempted to programmatically assign story names using code such as template literals, variable references, spread objects, function invocations, etc. However, because of limitations to static analysis, which Storybook relies on, Storybook only picks `name` properties when they are string literals: it cannot evaluate code.

Examples of **incorrect** code for this rule:

```js
export const A = { name: '1994' + 'definitely not my credit card PIN' }
export const A = { name: `N` }
export const A = { name: String(1994) }

const name = 'N'
export const A = { name }

const A = { name: `N` }
export { A }

const A = { name: String(1994) }
export { A }

const name = 'N'
const A = { name }
export { A }
```

Examples of **correct** code for this rule:

```js
export const A = { name: 'N' }
export const A = { name: 'N' }

const A = { name: 'N' }
export { A }

const A = { name: 'N' }
export { A }

const A = { name } // Not a Story (not exported)
```

## Further Reading

More discussion on issue [#111](https://github.com/storybookjs/eslint-plugin-storybook/issues/111)
