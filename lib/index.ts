/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "pnpm run update"
 */
// configs
import csf from './configs/csf'
import csfStrict from './configs/csf-strict'
import addonInteractions from './configs/addon-interactions'
import recommended from './configs/recommended'
import flatCsf from './configs/flat/csf'
import flatCsfStrict from './configs/flat/csf-strict'
import flatAddonInteractions from './configs/flat/addon-interactions'
import flatRecommended from './configs/flat/recommended'

// rules
import awaitInteractions from './rules/await-interactions'
import contextInPlayFunction from './rules/context-in-play-function'
import csfComponent from './rules/csf-component'
import defaultExports from './rules/default-exports'
import hierarchySeparator from './rules/hierarchy-separator'
import metaInlineProperties from './rules/meta-inline-properties'
import metaSatisfiesType from './rules/meta-satisfies-type'
import noRedundantStoryName from './rules/no-redundant-story-name'
import noStoriesOf from './rules/no-stories-of'
import noTitlePropertyInMeta from './rules/no-title-property-in-meta'
import noUninstalledAddons from './rules/no-uninstalled-addons'
import onlyCsf3 from './rules/only-csf3'
import preferPascalCase from './rules/prefer-pascal-case'
import storyExports from './rules/story-exports'
import useStorybookExpect from './rules/use-storybook-expect'
import useStorybookTestingLibrary from './rules/use-storybook-testing-library'

// export plugin
export = {
  configs: {
    // eslintrc configs
    csf: csf,
    'csf-strict': csfStrict,
    'addon-interactions': addonInteractions,
    recommended: recommended,

    // flat configs
    'flat/csf': flatCsf,
    'flat/csf-strict': flatCsfStrict,
    'flat/addon-interactions': flatAddonInteractions,
    'flat/recommended': flatRecommended,
  },
  rules: {
    'await-interactions': awaitInteractions,
    'context-in-play-function': contextInPlayFunction,
    'csf-component': csfComponent,
    'default-exports': defaultExports,
    'hierarchy-separator': hierarchySeparator,
    'meta-inline-properties': metaInlineProperties,
    'meta-satisfies-type': metaSatisfiesType,
    'no-redundant-story-name': noRedundantStoryName,
    'no-stories-of': noStoriesOf,
    'no-title-property-in-meta': noTitlePropertyInMeta,
    'no-uninstalled-addons': noUninstalledAddons,
    'only-csf3': onlyCsf3,
    'prefer-pascal-case': preferPascalCase,
    'story-exports': storyExports,
    'use-storybook-expect': useStorybookExpect,
    'use-storybook-testing-library': useStorybookTestingLibrary,
  },
}
