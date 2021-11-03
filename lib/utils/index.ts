// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'docsUrl'.
const docsUrl = (ruleName: any) => `https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/${ruleName}.md`

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isPlayFunc... Remove this comment to see the full error message
const isPlayFunction = (node: any) => {
  const propertyName = node.left && node.left.property && node.left.property.name
  return propertyName === 'play'
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  docsUrl,
  isPlayFunction,
}
