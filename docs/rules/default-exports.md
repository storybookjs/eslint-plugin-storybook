# Stories file should have a default export (default-exports)

Please describe the origin of the rule here.

@TODO: Explain the complications of not having component property (addon docs, controls, etc)

## Rule Details

This rule aims to...

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
  component: Button
}
export const Primary = {}
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
