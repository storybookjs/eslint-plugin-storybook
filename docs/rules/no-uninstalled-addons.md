# no-uninstalled-addons

<!-- RULE-CATEGORIES:START -->

**Included in these configurations**: <ul><li>recommended</li></ul>

<!-- RULE-CATEGORIES:END -->

## Rule Details

This rule checks if all addons in the storybook main.js file are properly listed in the root package.json of the npm project.

For instance, if the `@storybook/addon-links` is in the `.storybook/main.js` but is not listed in the `package.json` of the project, this rule will notify the user to add the addon to the package.json and install it.

As an important side note, this rule will check for the package.json in the same level of the .storybook folder.

Another very important side note: your ESLint config must allow the linting of the .storybook folder. By default, ESLint ignores all dot-files so this folder will be ignored. In order to allow this rule to lint the .storybook/main.js file, it's important to configure ESLint to lint this file. This can be achieved by writing something like:

```
// Inside your .eslintignore file
!.storybook
```

For more info, check this [ESLint documentation](https://eslint.org/docs/latest/user-guide/configuring/ignoring-code#:~:text=In%20addition%20to,contents%2C%20are%20ignored).

Examples of **incorrect** code for this rule:

```js
// in .storybook/main.js
module.exports = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions', // <-- this addon is not listed in the package.json
  ],
}

// package.json
{
  "devDependencies": {
    "@storybook/addon-links": "0.0.1",
    "@storybook/addon-essentials": "0.0.1",
  }
}
```

Examples of **correct** code for this rule:

```js
// in .storybook/main.js
module.exports = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
}

// package.json
{
  "devDependencies": {
    "@storybook/addon-links": "0.0.1",
    "@storybook/addon-essentials": "0.0.1",
    "@storybook/addon-interactions": "0.0.1"
  }
}
```

### Configure

Some Storybook folders use a different name for their config directory other than `.storybook`. This rule will not be applied there by default. If you want to have it, then you must add an override in your `.eslintrc.js` file, defining your config directory:

```js
{
  overrides: [
      {
        files: ['your-config-dir/main.@(js|cjs|mjs|ts)'],
        rules: {
          'storybook/no-uninstalled-addons': 'error',
        },
      },
    ],
}
```

## When Not To Use It

This rule is very handy to be used because if the user tries to start storybook but has forgotten to install the plugin, storybook will throw very weird errors that will give no clue to the user to what's going wrong. To prevent that, this rule should be always on.

## Further Reading

Check the issue in GitHub: https://github.com/storybookjs/eslint-plugin-storybook/issues/95
