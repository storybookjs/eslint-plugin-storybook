/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "yarn update-all"
 */
export = {
  extends: require.resolve('./csf'),
  rules: {
    'import/no-anonymous-default-export': 'off',
    'storybook/no-stories-of': 'error',
    'storybook/no-title-property-in-meta': 'error',
  },

  overrides: [
    {
      files: ['.storybook/main.@(js|cjs|mjs|ts)'],
      rules: {
        'storybook/use-default-export-in-main': 'error',
      },
    },
  ],
}
