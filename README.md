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
npm i eslint --save-dev
```

Next, install `eslint-plugin-storybook`:

```sh
npm install eslint-plugin-storybook --save-dev
```

## Usage

Add `storybook` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["storybook"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "storybook/csf-component": "warn",
    "storybook/meta-inline-properties": "error",
    "storybook/hierarchy-separator": "off"
  }
}
```

### Run the plugin only against test files

With the default setup mentioned before, `eslint-plugin-storybook` will be run against your whole codebase. If you want to run this plugin only against your stories files, you have the following options:

#### ESLint `overrides`

One way of restricting ESLint config by file patterns is by using [ESLint `overrides`](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-based-on-glob-patterns).

Assuming you are using the recommended `.stories` extension in your files, the following config would run `eslint-plugin-storybook` only against your stories files:

```javascript
// .eslintrc
{
  // 1) Here we have our usual config which applies to the whole project, so we don't put storybook preset here.
  "extends": ["airbnb", "plugin:prettier/recommended"],

  // 2) We load eslint-plugin-storybook globally with other ESLint plugins.
  "plugins": ["react-hooks", "storybook"],

  "overrides": [
    {
      // 3) Now we enable eslint-plugin-storybook rules or preset only for matching files!
      // you can use the one defined in your main.js
      "files": ['src/**/*.stories.@(js|jsx|ts|tsx)'],
      "extends": ["plugin:storybook/csf"],

      // 4) Optional: you can override specific rules here
      "rules": {
        'storybook/csf-component': 'warn'
      }
    },
  ],
};
```

#### ESLint Cascading and Hierarchy

Another approach for customizing ESLint config by paths is through [ESLint Cascading and Hierarchy](https://eslint.org/docs/user-guide/configuring/configuration-files#cascading-and-hierarchy). This is useful if all your stories are placed under the same folder, so you can place there another `.eslintrc` where you enable `eslint-plugin-storybook` for applying it only to the files under such folder, rather than enabling it on your global `.eslintrc` which would apply to your whole project.

## Supported Rules

- Fill in provided rules here

<!-- RULES-LIST:START -->

**Key**: 🔧 = fixable

**Configurations**: ![csf-badge][] = csf, ![csf-strict-badge][] = csf-strict

| Name                                                                               | Description                                      | 🔧  | Included in configurations |
| ---------------------------------------------------------------------------------- | ------------------------------------------------ | --- | -------------------------- |
| [`storybook/csf-component`](./docs/rules/csf-component.md)                         | The component property should be set             |     | csf                        |
| [`storybook/default-exports`](./docs/rules/default-exports.md)                     | Story files should have a default export         |     | csf                        |
| [`storybook/hierarchy-separator`](./docs/rules/hierarchy-separator.md)             | Deprecated hierachy separator in title property  | 🔧  | csf                        |
| [`storybook/meta-inline-properties`](./docs/rules/meta-inline-properties.md)       | Meta should only have inline properties          |     | csf                        |
| [`storybook/no-redundant-story-name`](./docs/rules/no-redundant-story-name.md)     | A story should have redundant name property      | 🔧  | csf                        |
| [`storybook/no-stories-of`](./docs/rules/no-stories-of.md)                         | storiesOf is deprecated and should not be used   |     | csf-strict                 |
| [`storybook/no-title-property-in-meta`](./docs/rules/no-title-property-in-meta.md) | Do not define a title in meta                    | 🔧  | csf-strict                 |
| [`storybook/prefer-pascal-case`](./docs/rules/prefer-pascal-case.md)               | Stories should use PascalCase I am changing this | 🔧  | csf                        |

<!-- RULES-LIST:END -->
