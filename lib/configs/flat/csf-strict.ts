/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content, execute "pnpm run update-all"
 */
import config from './csf'

export = [
  ...config,
  {
    name: 'storybook:csf-strict:rules',
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)', '**/*.story.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'import/no-anonymous-default-export': 'off',
      'storybook/no-stories-of': 'error',
      'storybook/no-title-property-in-meta': 'error',
    } as const,
  },
]
