# Use storybook testing library package (use-storybook-testing-library)

<!-- RULE-CATEGORIES:START -->

**Included in these configurations**: <ul><li>addon-interactions</li><li>recommended</li></ul>

<!-- RULE-CATEGORIES:END -->

## Rule Details

Storybook provides an instrumented version of testing library in the [@storybook/testing-library](https://github.com/storybookjs/testing-library/) package.
When [writing interactions](https://storybook.js.org/docs/react/essentials/interactions), make sure to use the helper functions from `@storybook/testing-library`, so that addon-interactions can intercept these helper functions and allow you to step through them when debugging.

Examples of **incorrect** code for this rule:

```js
// wrong import!
import { within } from '@testing-library/react'

Default.play = async (context) => {
  const canvas = within(context.canvasElement)
}
```

Examples of **correct** code for this rule:

```js
// correct import.
import { within } from '@storybook/testing-library'

Default.play = async (context) => {
  const canvas = within(context.canvasElement)
}
```

## When Not To Use It

This rule should not be applied in test files. Please ensure you are defining the storybook rules only for story files. You can see more details [here](https://github.com/storybookjs/eslint-plugin-storybook#eslint-overrides).

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
