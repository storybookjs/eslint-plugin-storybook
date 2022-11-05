# Deprecated hierarchy separator in title property (`storybook/hierarchy-separator`)

⚠️ This rule _warns_ in the following configs: `csf`, `csf-strict`, ✅ `recommended`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Since Storybook 6.0, the ability to specify the hierarchy separators (how you control the grouping of story kinds in the sidebar) was removed. There is now a single separator `/`, which cannot be configured. If you are using `|` or `.` as a separator, you should change all of them to `/`.

Examples of **incorrect** code for this rule:

```js
export default {
  title: 'Components|Forms/Input',
  component: Input,
}
```

Examples of **correct** code for this rule:

```js
export default {
  title: 'Components/Forms/Input',
  component: Input,
}
```

## Further Reading

For more details about this change: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#removed-hierarchy-separators

To automatically migrate all of your codebase and fix this issue, run this codemod in the root folder of your project:

```sh
npx sb@next migrate upgrade-hierarchy-separators --glob="*/**/*.stories.@(tsx|jsx|ts|js)"
```
