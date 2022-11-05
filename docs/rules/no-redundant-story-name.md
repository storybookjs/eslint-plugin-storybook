# A story should not have a redundant name property (`storybook/no-redundant-story-name`)

⚠️ This rule _warns_ in the following configs: `csf`, `csf-strict`, ✅ `recommended`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

Storybook automatically resolves a story name based on its named export. You can rename any particular story you'd like, but if the name is redundant to what Storybook will resolve, you don't need to do that.

Examples of **incorrect** code for this rule:

```js
export const PrimaryButton = {
  // no need for this, as Storybook will resolve to this name already
  name: 'Primary Button',
}
```

Examples of **correct** code for this rule:

```js
export const PrimaryButton = {
  name: 'I am the primary',
}
```

## When Not To Use It

When you set a custom name for a story, it will make sure that the resolved story name will always be that same name, regardless if you rename the export later on. If that is your reason to keep story names set even if they are redundant, you should turn this rule off.
