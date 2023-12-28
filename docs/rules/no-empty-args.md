# no-empty-args

<!-- RULE-CATEGORIES:START -->

**Included in these configurations**: <ul><li>recommended</li><li>csf</li></ul>

<!-- RULE-CATEGORIES:END -->

## Rule Details

Empty args is meaningless and should not be used.

Examples of **incorrect** code for this rule:

```js
export default {
  component: Button,
  args: {},
}
```

Examples of **correct** code for this rule:

```js
export default {
  component: Button,
}
```

## When Not To Use It

If you're not strictly enforcing this rule in your codebase (thus allowing empty args), you should turn this rule off.
