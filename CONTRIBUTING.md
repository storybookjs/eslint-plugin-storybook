## Table of Contents

- [1. About the Project](#about-the-project)
- [2. Getting Started](#getting-started)
  - [2.1. Creating a new rule](#creating-a-new-rule)
    - [2.1.1. Important metadata for a rule](#important-metadata-for-a-rule)
  - [2.2. Testing rules](#testing-rules)
  - [2.3. Updating configs or documentation](#updating-configs-or-documentation)
- [3. Useful resources](#useful-resources)

# About the project

The ESLint plugin for Storybook aims to help steer developers into using the best practices when writing their stories. The rules should be auto-fixable when possible, to improve the developer experience as much as we can.

# Getting started

First of all, thank you so much for taking the time to contribute to this project.

### Creating a new rule

Run the following command and answer the prompts:

```sh
yarn generate-rule
```

This command will generate the rule file, tests as well as the documentation page.
The generated files will look like this:

```
docs/rules/<rule-name>.md
lib/rules/<rule-name>.js
tests/lib/rules/<rule-name>.js
```

This command will auto-generate the test file with an example for you. Please refer to existing tests if more reference is needed.

#### Important metadata for a rule

```js
import { CategoryId } from '../utils/constants'

module.exports = {
  meta: {
    docs: {
      categories: [CategoryId.RECOMMENDED], // You should always use an existing category from the CategoryId enum], or create a new one there
      excludeFromConfig: true, // If the rule is not ready to be shipped in any category, set this flag to true, otherwise remove it
    },
  },
  ...otherProperties,
}
```

### Testing rules

Run the following command for testing the rules:

```sh
yarn test --watch
```

### Updating configs or documentation

When you make changes to rules or create/delete rules, the configuration files and documentation have to be updated. For that, run the following command:

```sh
yarn update-all
```

### Useful resources

- The [ESLint official developer](https://eslint.org/docs/developer-guide/working-with-rules) can be useful to assist when writing rules
- The [AST Explorer](https://astexplorer.net/) website is the perfect place to get reference to writing rules. Given that ESLint rules are based in AST (Abstract Syntax Tree), you can paste an example code there and visualize all properties of the resulting AST of that code.
- Storybook has a discord community! And we need more people like you. Please [join us](https://discord.gg/storybook) and say hi in the #contributors channel! 👋
