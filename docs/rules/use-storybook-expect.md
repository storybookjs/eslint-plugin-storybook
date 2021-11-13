# Use expect from &#39;@storybook/jest&#39; (use-storybook-expect)

<!-- RULE-CATEGORIES:START -->

**Included in these configurations**: <ul><li>addon-interactions</li><li>recommended</li></ul>

<!-- RULE-CATEGORIES:END -->

## Rule Details

Storybook provides a browser compatible version of Jest's expect via the [@storybook/jest](https://github.com/storybookjs/jest) library.
When [writing interactions](https://storybook.js.org/docs/react/essentials/interactions) and asserting values, you should always use `expect` from the `@storybook/jest` library.

Examples of **incorrect** code for this rule:

```js
Default.play = () => {
  // using global expect from Jest. Will break on the browser
  expect(123).toEqual(123)
}
```

Examples of **correct** code for this rule:

```js
import { expect } from '@storybook/jest'

Default.play = () => {
  // using imported expect from storybook package
  expect(123).toEqual(123)
}
```

## When Not To Use It

This rule should not be applied in test files. Please ensure you are defining the storybook rules only for story files. You can see more details [here](https://github.com/storybookjs/eslint-plugin-storybook#eslint-overrides).

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
