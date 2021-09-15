# Deprecated hierarchy separator (hierarchy-separator)

Please describe the origin of the rule here.

For more details: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#removed-hierarchy-separators


To automatically migrate, run this codemod in the root folder of your project:
```sh
npx sb@next migrate upgrade-hierarchy-separators --glob="*/**/*.stories.@(tsx|jsx|ts|js)"
```

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

export default { 
  title: 'Components|Forms/Input,
  component: Input
}
```

Examples of **correct** code for this rule:

```js
export default { 
  title: 'Components/Forms/Input,
  component: Input
}
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
