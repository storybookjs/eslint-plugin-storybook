# Stories should use PascalCase (`storybook/prefer-pascal-case`)

⚠️ This rule _warns_ in the ✅ `recommended` config.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

As a best practice, stories should be defined in [_PascalCase_](https://en.wiktionary.org/wiki/Pascal_case). This makes it simpler to visually differ stories to other code. Plus, it makes it simpler to define regexes for [non-story exports](https://storybook.js.org/docs/react/api/csf#non-story-exports).

Examples of **incorrect** code for this rule:

```js
export const primaryButton = {}
```

Examples of **correct** code for this rule:

```js
export const PrimaryButton = {}
```

## Further Reading

More information about naming stories can be found here: https://storybook.js.org/docs/react/writing-stories/introduction#defining-stories
