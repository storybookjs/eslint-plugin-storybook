# storiesOf is deprecated and should not be used (no-stories-of)

Please describe the origin of the rule here.

To automatically migrate, run this codemod in the root folder of your project:
```sh
npx sb@next migrate storiesof-to-csf --glob="*/**/*.stories.@(tsx|jsx|ts|js)"
```

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';

storiesOf('Button', module)
  .add('primary', () => <Button primary />)
```

Examples of **correct** code for this rule:

```js
import Button from '../components/Button';
export default = {
  title: 'Button',
  component: Button
}

export const Primary = () => <Button primary />
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
