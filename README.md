<p align="center">
  <a href="https://storybook.js.org/">
    <img src="https://user-images.githubusercontent.com/321738/63501763-88dbf600-c4cc-11e9-96cd-94adadc2fd72.png" alt="Storybook" width="400" />
  </a>
</p>

<p align="center">Build bulletproof UI components faster</p>

<br/>

<p align="center">
  <a href="https://discord.gg/storybook">
    <img src="https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat" />
  </a>
  <a href="https://storybook.js.org/community/">
    <img src="https://img.shields.io/badge/community-join-4BC424.svg" alt="Storybook Community" />
  </a>
  <a href="#backers">
    <img src="https://opencollective.com/storybook/backers/badge.svg" alt="Backers on Open Collective" />
  </a>
  <a href="#sponsors">
    <img src="https://opencollective.com/storybook/sponsors/badge.svg" alt="Sponsors on Open Collective" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=storybookjs">
    <img src="https://badgen.net/twitter/follow/storybookjs?icon=twitter&label=%40storybookjs" alt="Official Twitter Handle" />
  </a>
</p>

# eslint-plugin-storybook

Best practice rules for Storybook

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm install eslint --save-dev
# or
yarn add eslint --dev
```

Next, install `eslint-plugin-storybook`:

```sh
npm install eslint-plugin-storybook --save-dev
# or
yarn add eslint-plugin-storybook --dev
```

And finally, add this to your `.eslintignore` file:

```
// Inside your .eslintignore file
!.storybook
```

This allows for this plugin to also lint your configuration files inside the .storybook folder, so that you always have a correct configuration and don't face any issues regarding mistyped addon names, for instance.

> For more info on why this line is required in the .eslintignore file, check this [ESLint documentation](https://eslint.org/docs/latest/user-guide/configuring/ignoring-code#:~:text=In%20addition%20to,contents%2C%20are%20ignored).

## Usage

Use `.eslintrc.*` file to configure rules. See also: <https://eslint.org/docs/user-guide/configuring>

Add `plugin:storybook/recommended` to the extends section of your `.eslintrc` configuration file. Note that we can omit the `eslint-plugin-` prefix:

```js
{
  // extend plugin:storybook/<configuration>, such as:
  "extends": ["plugin:storybook/recommended"]
}
```

This plugin will only be applied to files following the `*.stories.*` (we recommend this) or `*.story.*` pattern. This is an automatic configuration, so you don't have to do anything.

### Overriding/disabling rules

Optionally, you can override, add or disable rules settings. You likely don't want these settings to be applied in every file, so make sure that you add a `overrides` section in your `.eslintrc.*` file that applies the overrides only to your stories files.

```js
{
  "overrides": [
    {
      // or whatever matches stories specified in .storybook/main.js
      "files": ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      "rules": {
        // example of overriding a rule
        'storybook/hierarchy-separator': 'error',
        // example of disabling a rule
        'storybook/default-exports': 'off',
      }
    }
  ]
}
```

### MDX Support

This plugin does not support MDX files.

## Supported Rules and configurations

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                         | Description                                                                                                                   | 💼                                                                    | ⚠️                                      | 🔧  | 💡  |
| :--------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :-------------------------------------- | :-- | :-- |
| [await-interactions](docs/rules/await-interactions.md)                       | Interactions should be awaited                                                                                                | ![badge-addon-interactions][] ✅                                      |                                         | 🔧  | 💡  |
| [context-in-play-function](docs/rules/context-in-play-function.md)           | Pass a context when invoking play function of another story                                                                   | ![badge-addon-interactions][] ✅                                      |                                         |     |     |
| [csf-component](docs/rules/csf-component.md)                                 | The component property should be set                                                                                          |                                                                       | ![badge-csf][] ![badge-csf-strict][]    |     |     |
| [default-exports](docs/rules/default-exports.md)                             | Story files should have a default export                                                                                      | ![badge-csf][] ![badge-csf-strict][] ✅                               |                                         | 🔧  | 💡  |
| [hierarchy-separator](docs/rules/hierarchy-separator.md)                     | Deprecated hierarchy separator in title property                                                                              |                                                                       | ![badge-csf][] ![badge-csf-strict][] ✅ | 🔧  | 💡  |
| [meta-inline-properties](docs/rules/meta-inline-properties.md)               | Meta should only have inline properties                                                                                       |                                                                       |                                         |     |     |
| [no-redundant-story-name](docs/rules/no-redundant-story-name.md)             | A story should not have a redundant name property                                                                             |                                                                       | ![badge-csf][] ![badge-csf-strict][] ✅ | 🔧  | 💡  |
| [no-stories-of](docs/rules/no-stories-of.md)                                 | The storiesOf API is deprecated and should not be used                                                                        | ![badge-csf-strict][]                                                 |                                         |     |     |
| [no-title-property-in-meta](docs/rules/no-title-property-in-meta.md)         | Do not define a title in meta                                                                                                 | ![badge-csf-strict][]                                                 |                                         | 🔧  | 💡  |
| [no-uninstalled-addons](docs/rules/no-uninstalled-addons.md)                 | This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name. | ![badge-addon-interactions][] ![badge-csf][] ![badge-csf-strict][] ✅ |                                         |     |     |
| [prefer-pascal-case](docs/rules/prefer-pascal-case.md)                       | Stories should use PascalCase                                                                                                 |                                                                       | ✅                                      | 🔧  | 💡  |
| [story-exports](docs/rules/story-exports.md)                                 | A story file must contain at least one story export                                                                           | ![badge-csf][] ![badge-csf-strict][] ✅                               |                                         |     |     |
| [use-storybook-expect](docs/rules/use-storybook-expect.md)                   | Use expect from `@storybook/jest`                                                                                             | ![badge-addon-interactions][] ✅                                      |                                         | 🔧  | 💡  |
| [use-storybook-testing-library](docs/rules/use-storybook-testing-library.md) | Do not use testing-library directly on stories                                                                                | ![badge-addon-interactions][] ✅                                      |                                         | 🔧  | 💡  |

<!-- end auto-generated rules list -->

[badge-csf]: https://img.shields.io/badge/-csf-pink.svg
[badge-csf-strict]: https://img.shields.io/badge/-csf--strict-red.svg
[badge-addon-interactions]: https://img.shields.io/badge/-addon--interactions-blue.svg

## Contributors

Looking into improving this plugin? That would be awesome!
Please refer to [the contributing guidelines](./CONTRIBUTING.md) for steps to contributing.

## License

[MIT](./LICENSE)
