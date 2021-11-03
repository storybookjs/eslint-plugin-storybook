export const docsUrl = (ruleName: any) =>
  `https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/${ruleName}.md`

export const isPlayFunction = (node: any) => {
  const propertyName = node.left && node.left.property && node.left.property.name
  return propertyName === 'play'
}
