# Do not import renderer packages directly in stories (no-renderer-packages)

<!-- RULE-CATEGORIES:START -->

**Included in these configurations**: <ul><li>recommended</li><li>flat/recommended</li></ul>

<!-- RULE-CATEGORIES:END -->

## Rule Details

This rule prevents importing Storybook renderer packages directly in stories. Instead, you should use framework-specific packages that are designed for your build tool (e.g., Vite, webpack).

Examples of **incorrect** code for this rule:

```js
import { something } from '@storybook/react'
import { something } from '@storybook/vue3'
import { something } from '@storybook/web-components'
```

Examples of **correct** code for this rule:

```js
import { something } from '@storybook/react-vite'
import { something } from '@storybook/vue3-webpack5'
import { something } from '@storybook/web-components-vite'
```

## When Not To Use It

If you have a specific need to use renderer packages directly in your stories, you can disable this rule. However, it's recommended to use the framework-specific packages as they are optimized for your build tool.

## Further Reading

For more information about Storybook's framework-specific packages and build tools, see:

- [Storybook for React](https://storybook.js.org/docs/react/get-started/install)
- [Storybook for Vue](https://storybook.js.org/docs/vue/get-started/install)
- [Storybook for Web Components](https://storybook.js.org/docs/web-components/get-started/install)
