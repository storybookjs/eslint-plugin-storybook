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

## Usage

Add the following eslint configuration:

1. Add `storybook` to the plugins section of your `.eslintrc` configuration file. Note that we can omit the `eslint-plugin-` prefix:

   ```json
   {
     "plugins": ["storybook"]
   }
   ```

   <details>
     <summary>Why not use the "extends" option?</summary>
     The "extends" option applies to <em>all</em> files you're linting against. The rules in this plugin are intended only for Storybook story files and would conflict with your other non-story files.
   </details>

2. Then, define which rule configurations to extend in your eslint config.

   > It's important to understand that **Storybook linting rules should only be run against your stories files**. You don't want these rules to affect your other files—such as production or test code—as they might conflict with rules from other ESLint plugins.

   There are two ways of doing this:

   1. #### ESLint `overrides`

      One way of restricting ESLint config by file patterns is by using [ESLint `overrides`](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-based-on-glob-patterns).

      Assuming you are using the recommended `.stories` extension in your files, the following config would run `eslint-plugin-storybook` only against your stories files:

      ```javascript
      // .eslintrc
      {
        // 1) This applies to the whole project, so we don't put the storybook configuration here.
        "extends": ["airbnb", "plugin:prettier/recommended"],

        // 2) We load eslint-plugin-storybook globally with other ESLint plugins.
        "plugins": ["react-hooks", "storybook"],

        "overrides": [
          {
            // 3) Now we enable eslint-plugin-storybook rules or preset only for matching files!
            //    For the files glob, adjust the one from `.storybook/main.js` to be relative to your eslint config file.
            "files": ['./src/**/*.stories.@(js|jsx|ts|tsx)'],
            "extends": ["plugin:storybook/recommended"],

            // 4) Optional: You can override or disable specific rules here, if you want.
            "rules": {
              'storybook/no-redundant-story-name': 'error'
            }
          },
        ],
      };
      ```

   2. #### ESLint Cascading and Hierarchy

      If all your stories are placed under the same folder that contains only story files, another approach for customizing ESLint config by paths is through [ESLint Cascading and Hierarchy](https://eslint.org/docs/user-guide/configuring/configuration-files#cascading-and-hierarchy). Place another `.eslintrc` in that folder, where you enable `eslint-plugin-storybook` (this time via the top-level "extends" option). With this setup, you apply the plugin's rules only to the files in that folder, rather than enabling it on your global `.eslintrc`, which would apply to your whole project.

## Supported Rules

<!-- RULES-LIST:START -->

**Key**: 🔧 = fixable

**Configurations**: csf, csf-strict, addon-interactions, recommended

| Name                                                                                       | Description                                       | 🔧  | Included in configurations      |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------- | --- | ------------------------------- |
| [`storybook/await-interactions`](./docs/rules/await-interactions.md)                       | Interactions should be awaited                    | 🔧  | addon-interactions, recommended |
| [`storybook/csf-component`](./docs/rules/csf-component.md)                                 | The component property should be set              |     | csf                             |
| [`storybook/default-exports`](./docs/rules/default-exports.md)                             | Story files should have a default export          |     | csf, recommended                |
| [`storybook/hierarchy-separator`](./docs/rules/hierarchy-separator.md)                     | Deprecated hierachy separator in title property   | 🔧  | csf, recommended                |
| [`storybook/no-redundant-story-name`](./docs/rules/no-redundant-story-name.md)             | A story should not have a redundant name property | 🔧  | csf, recommended                |
| [`storybook/no-stories-of`](./docs/rules/no-stories-of.md)                                 | storiesOf is deprecated and should not be used    |     | csf-strict                      |
| [`storybook/no-title-property-in-meta`](./docs/rules/no-title-property-in-meta.md)         | Do not define a title in meta                     | 🔧  | csf-strict                      |
| [`storybook/prefer-pascal-case`](./docs/rules/prefer-pascal-case.md)                       | Stories should use PascalCase                     | 🔧  | recommended                     |
| [`storybook/use-storybook-expect`](./docs/rules/use-storybook-expect.md)                   | Use expect from `@storybook/jest`                 | 🔧  | addon-interactions, recommended |
| [`storybook/use-storybook-testing-library`](./docs/rules/use-storybook-testing-library.md) | Do not use testing-library directly on stories    | 🔧  | addon-interactions, recommended |

<!-- RULES-LIST:END -->

## Contributors

Looking into improving this plugin? That would be awesome!
Please refer to [the contributing guidelines](./CONTRIBUTING.md) for steps to contributing.
