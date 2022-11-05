# Pass a context when invoking play function of another story (`storybook/context-in-play-function`)

💼 This rule is enabled in the following configs: `addon-interactions`, ✅ `recommended`.

<!-- end auto-generated rule header -->

## Rule Details

When invoking the play function from another story, it's necessary to pass the full context as an argument to it. The context that Storybook provides to the play function has internal functionality that is necessary for the interactions to work correctly.

Examples of **incorrect** code for this rule:

```js
import { within, userEvent } from '@storybook/testing-library'

MyStory.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  // not passing any context
  await MyOtherStory.play()

  userEvent.click(canvas.getByRole('button'))
}
```

```js
import { within, userEvent } from '@storybook/testing-library'

MyStory.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  // not passing the full context
  await MyOtherStory.play({ canvasElement })

  userEvent.click(canvas.getByRole('button'))
}
```

Examples of **correct** code for this rule:

```js
import { within, userEvent } from '@storybook/testing-library'

MyStory.play = (context) => {
  const canvas = within(context.canvasElement)
  // passing full context 👍
  await MyOtherStory.play(context)

  await userEvent.click(canvas.getByRole('button'))
}
```

## When Not To Use It

This rule should not be applied in test files. Please ensure you are defining the storybook rules only for story files. You can see more details [here](https://github.com/storybookjs/eslint-plugin-storybook#eslint-overrides).
