# Story files should have a default export (`storybook/default-exports`)

💼 This rule is enabled in the following configs: `csf`, `csf-strict`, ✅ `recommended`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

In [CSF](https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format), a story file should contain a _default export_ that describes the component, and _named exports_ that describe the stories. This rule enforces the definition of a default export in story files.

Examples of **incorrect** code for this rule:

```js
// no default export
export const Primary = {}
```

Examples of **correct** code for this rule:

```js
export default {
  title: 'Button',
  args: { primary: true },
  component: Button,
}
export const Primary = {}
```

## When Not To Use It

This rule should only be applied in your `.stories.*` files. Please ensure you are defining the storybook rules only for story files. You can see more details [here](https://github.com/storybookjs/eslint-plugin-storybook#eslint-overrides).

If you're using [CSF in MDX](https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#csf-stories-with-mdx-docs), you should disable this rule for the stories that use CSF in MDX. You can see how to override the rule [here](https://github.com/storybookjs/eslint-plugin-storybook#eslint-overrides).

## Further Reading

More information about defining stories here: <https://storybook.js.org/docs/react/writing-stories/introduction#defining-stories>
