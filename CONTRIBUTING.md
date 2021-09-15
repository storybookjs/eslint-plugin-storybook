### Creating a new Rule

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

This command will auto-generate the test file, but that has to be slightly changed. Please refer to existing tests for other rules and change the auto-generated code to use the same utilities as other tests.

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
