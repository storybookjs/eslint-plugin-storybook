/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "yarn update-all"
 */
export = {
  plugins: ['storybook'],
  overrides: [
    {
      files: ['*.stories.@(ts|tsx|js|mjs|cjs)', '*.story.@(ts|tsx|js|mjs|cjs)'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'storybook/await-interactions': 'error',
        'storybook/use-storybook-expect': 'error',
        'storybook/use-storybook-testing-library': 'error',
      },
    },
  ],
}
