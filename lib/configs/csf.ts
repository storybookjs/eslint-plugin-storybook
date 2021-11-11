/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "yarn update-all"
 */
export = {
  plugins: ['storybook'],
  overrides: [
    {
      files: ['*.stor(y|ies).([mc]?[jt])sx?'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'storybook/csf-component': 'warn',
        'storybook/default-exports': 'error',
        'storybook/hierarchy-separator': 'warn',
        'storybook/no-redundant-story-name': 'warn',
      },
    },
  ],
}
