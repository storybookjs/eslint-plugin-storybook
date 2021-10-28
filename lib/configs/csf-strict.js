/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "yarn update-all"
 */
module.exports = {
  extends: require.resolve('./csf'),
  rules: {
    'import/no-anonymous-default-export': 'off',
    'storybook/csf-component': 'warn',
    'storybook/default-exports': 'error',
    'storybook/hierarchy-separator': 'warn',
    'storybook/meta-inline-properties': [
      'error',
      {
        csfVersion: 3,
      },
    ],
    'storybook/no-redundant-story-name': 'warn',
    'storybook/prefer-pascal-case': 'warn',
    'storybook/no-stories-of': 'error',
    'storybook/no-title-property-in-meta': 'error',
  },
}
