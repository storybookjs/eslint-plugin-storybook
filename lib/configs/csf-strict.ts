/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "yarn update-all"
 */
export default {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  extends: require.resolve('./csf'),
  rules: {
    'import/no-anonymous-default-export': 'off',
    'storybook/no-stories-of': 'error',
    'storybook/no-title-property-in-meta': 'error',
  },
}
