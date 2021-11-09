# Meta should only have inline properties (meta-inline-properties)

<!-- RULE-CATEGORIES:START -->
<!-- RULE-LIST:END -->

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
const title = 'Button'
const args = { primary: true }

export default {
  title,
  args,
  component: Button,
}
```

Examples of **correct** code for this rule:

```js
export default {
  title: 'Button',
  args: { primary: true },
  component: Button,
}
```

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
