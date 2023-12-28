/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "yarn update-all"
 */
export = {
  plugins: ['storybook'],
  overrides: [
    {
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)', '*.story.@(ts|tsx|js|jsx|mjs|cjs)'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'storybook/csf-component': 'warn',
        'storybook/default-exports': 'error',
        'storybook/hierarchy-separator': 'warn',
        'storybook/no-empty-args': 'error',
        'storybook/no-redundant-story-name': 'warn',
        'storybook/story-exports': 'error',
      },
    },
    {
      files: ['.storybook/main.@(js|cjs|mjs|ts)'],
      rules: {
        'storybook/no-uninstalled-addons': 'error',
      },
    },
  ],
}
