const docsUrl = (ruleName) =>
  `https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/${ruleName}.md`

const isPlayFunction = (node) => {
  const propertyName = node.left && node.left.property && node.left.property.name
  return propertyName === 'play'
}

module.exports = {
  docsUrl,
  isPlayFunction,
}
