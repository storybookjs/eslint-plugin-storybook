# Component property must be set in meta (csf-component)

<!-- RULE-CATEGORIES:START -->
<!-- RULE-LIST:END -->

## Rule Details

@TODO: Explain the complications of not having component property (addon docs, controls, etc)
This rule aims to...

Examples of **incorrect** code for this rule:

```js
export default {
  title: 'Button',
}
```

Examples of **correct** code for this rule:

```js
export default {
  title: 'Button',
  component: Button,
}
```

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
