/**
 * @fileoverview This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name.
 * @author Andre Santos
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

import { createStorybookRule } from '../utils/create-storybook-rule'
import { CategoryId } from '../utils/constants'
import {
  isObjectExpression,
  isProperty,
  isIdentifier,
  isArrayExpression,
  isLiteral,
} from '../utils/ast'
import { Property } from '@typescript-eslint/types/dist/ast-spec'
import { BigIntLiteral, BooleanLiteral, NullLiteral, StringLiteral } from 'typescript'
import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export = createStorybookRule({
  name: 'no-uninstalled-addons',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description:
        'This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name.',
      categories: [CategoryId.RECOMMENDED],
      recommended: 'error', // or 'error'
    },
    messages: {
      addonIsNotInstalled: `The {{ addonName }} is not installed. Did you forget to install it?`,
    },

    schema: [], // Add a schema if the rule has options. Otherwise remove this
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // this will not only exclude the nullables but it will also exclude the type undefined from them, so that TS does not complain
    function excludeNullable<T>(item: T | undefined): item is T {
      return !!item
    }

    type MergeDepsWithDevDeps = (packageJson: Record<string, string>) => string[]
    const mergeDepsWithDevDeps: MergeDepsWithDevDeps = (packageJson) => {
      const deps = Object.keys(packageJson.dependencies || {})
      const devDeps = Object.keys(packageJson.devDependencies || {})
      return [...deps, ...devDeps]
    }

    type IsAddonInstalled = (addon: string, installedAddons: string[]) => boolean
    const isAddonInstalled: IsAddonInstalled = (addon, installedAddons) => {
      return installedAddons.includes(addon)
    }

    type AreThereAddonsNotInstalled = (
      addons: string[],
      installedSbAddons: string[]
    ) => false | { name: string }[]
    const areThereAddonsNotInstalled: AreThereAddonsNotInstalled = (addons, installedSbAddons) => {
      const result = addons
        .filter((addon) => !isAddonInstalled(addon, installedSbAddons))
        .map((addon) => ({ name: addon }))
      return result.length ? result : false
    }

    type GetPackageJson = (path: string) => Record<string, any>

    const getPackageJson: GetPackageJson = (path) => {
      const packageJson = {
        devDependencies: {},
        dependencies: {},
      }
      try {
        const file = readFileSync(path, 'utf8')
        const parsedFile = JSON.parse(file)
        packageJson.dependencies = parsedFile.dependencies || {}
        packageJson.devDependencies = parsedFile.devDependencies || {}
      } catch (e) {
        console.error(
          'Could not fetch package.json - it is probably not in the same directory as the .storybook folder'
        )
      }

      return packageJson
    }

    const extractAllAddonsFromTheStorybookConfig = (addonsProperty: Property | undefined) => {
      if (addonsProperty && isArrayExpression(addonsProperty.value)) {
        // extract all nodes taht are a string inside the addons array
        const nodesWithAddons = addonsProperty.value.elements
          .map((elem) => (isLiteral(elem) ? { value: elem.value, node: elem } : undefined))
          .filter(excludeNullable)

        const listOfAddonsInString = nodesWithAddons.map((elem) => elem.value) as string[]

        // extract all nodes that are an object inside the addons array
        const nodesWithAddonsInObj = addonsProperty.value.elements
          .map((elem) => (isObjectExpression(elem) ? elem : { properties: [] }))
          .map((elem) => {
            const property: Property = elem.properties.find(
              (prop) => isProperty(prop) && isIdentifier(prop.key) && prop.key.name === 'name'
            ) as Property
            return isLiteral(property?.value)
              ? { value: property.value.value, node: property.value }
              : undefined
          })
          .filter(excludeNullable)

        const listOfAddonsInObj = nodesWithAddonsInObj.map((elem) => elem.value) as string[]

        const listOfAddons = [...listOfAddonsInString, ...listOfAddonsInObj]
        const listOfAddonElements = [...nodesWithAddons, ...nodesWithAddonsInObj]
        return { listOfAddons, listOfAddonElements }
      }

      return { listOfAddons: [], listOfAddonElements: [] }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      AssignmentExpression: function (node) {
        // when this is running for .storybook/main.js, we get the path to the folder which contains the package.json of the
        // project. This will be handy for monorepos that may be running ESLint in a node process in another folder.
        const projectRoot = context.getPhysicalFilename
          ? resolve(context.getPhysicalFilename(), '../../')
          : './'

        const packageJsonObject = getPackageJson(`${projectRoot}/package.json`)
        const depsAndDevDeps = mergeDepsWithDevDeps(packageJsonObject)

        if (isObjectExpression(node.right)) {
          const addonsProp = node.right.properties.find(
            (prop) => isProperty(prop) && isIdentifier(prop.key) && prop.key.name === 'addons'
          ) as Property | undefined

          const { listOfAddons, listOfAddonElements } =
            extractAllAddonsFromTheStorybookConfig(addonsProp)

          const result = areThereAddonsNotInstalled(listOfAddons, depsAndDevDeps)

          if (result) {
            const elemsWithErrors = listOfAddonElements.filter(
              (elem) => !!result.find((addon) => addon.name === elem.value)
            )

            elemsWithErrors.forEach((elem) => {
              context.report({
                node: elem.node,
                messageId: 'addonIsNotInstalled',
                data: { addonName: elem.value },
              })
            })
          }
        }
      },
    }
  },
})
