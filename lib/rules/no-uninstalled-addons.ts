/**
 * @fileoverview This rule identifies storybook addons that are invalid because they are either not installed or contain a typo in their name.
 * @author Andre "andrelas1" Santos
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
  isVariableDeclarator,
  isVariableDeclaration,
} from '../utils/ast'
import { Property, ArrayExpression } from '@typescript-eslint/types/dist/ast-spec'

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

    schema: [
      {
        type: 'object',
        properties: {
          packageJsonLocation: {
            type: 'string',
          },
        },
      },
    ], // Add a schema if the rule has options. Otherwise remove this
  },

  create(context) {
    // variables should be defined here
    const packageJsonLocation = context.options.reduce((acc, val) => {
      return val['packageJsonLocation'] || acc
    }, '')

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
      // cleanup /register or /preset + file extension from registered addon
      const addonName = addon
        .replace(/\.[mc]?js$/, '')
        .replace(/\/register$/, '')
        .replace(/\/preset$/, '')

      return installedAddons.includes(addonName)
    }

    type AreThereAddonsNotInstalled = (
      addons: string[],
      installedSbAddons: string[]
    ) => false | { name: string }[]
    const areThereAddonsNotInstalled: AreThereAddonsNotInstalled = (addons, installedSbAddons) => {
      const result = addons
        // remove local addons (e.g. ./my-addon/register.js)
        .filter((addon) => !addon.startsWith('.'))
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
        throw new Error(
          `The provided path in your eslintrc.json - ${path} is not a valid path to a package.json file or your package.json file is not in the same folder as ESLint is running from.`
        )
      }

      return packageJson
    }

    const extractAllAddonsFromTheStorybookConfig = (
      addonsExpression: ArrayExpression | undefined
    ) => {
      if (addonsExpression?.elements) {
        // extract all nodes taht are a string inside the addons array
        const nodesWithAddons = addonsExpression.elements
          .map((elem) => (isLiteral(elem) ? { value: elem.value, node: elem } : undefined))
          .filter(excludeNullable)

        const listOfAddonsInString = nodesWithAddons.map((elem) => elem.value) as string[]

        // extract all nodes that are an object inside the addons array
        const nodesWithAddonsInObj = addonsExpression.elements
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

    function reportUninstalledAddons(addonsProp: ArrayExpression) {
      // when this is running for .storybook/main.js, we get the path to the folder which contains the package.json of the
      // project. This will be handy for monorepos that may be running ESLint in a node process in another folder.
      const getProjectRoot = () =>
        context.getPhysicalFilename ? resolve(context.getPhysicalFilename(), '../../') : './'
      let packageJsonObject: Record<string, any>
      try {
        packageJsonObject = getPackageJson(packageJsonLocation || `./package.json`)
      } catch (e) {
        // if we cannot find the package.json, we cannot check if the addons are installed
        throw new Error(e as string)
      }

      const depsAndDevDeps = mergeDepsWithDevDeps(packageJsonObject)

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

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      AssignmentExpression: function (node) {
        if (isObjectExpression(node.right)) {
          const addonsProp = node.right.properties.find(
            (prop): prop is Property =>
              isProperty(prop) && isIdentifier(prop.key) && prop.key.name === 'addons'
          )

          if (addonsProp && addonsProp.value && isArrayExpression(addonsProp.value)) {
            reportUninstalledAddons(addonsProp.value)
          }
        }
      },
      ExportDefaultDeclaration: function (node) {
        if (isObjectExpression(node.declaration)) {
          const addonsProp = node.declaration.properties.find(
            (prop): prop is Property =>
              isProperty(prop) && isIdentifier(prop.key) && prop.key.name === 'addons'
          )

          if (addonsProp && addonsProp.value && isArrayExpression(addonsProp.value)) {
            reportUninstalledAddons(addonsProp.value)
          }
        }
      },
      ExportNamedDeclaration: function (node) {
        const addonsProp =
          isVariableDeclaration(node.declaration) &&
          node.declaration.declarations.find(
            (decl) =>
              isVariableDeclarator(decl) && isIdentifier(decl.id) && decl.id.name === 'addons'
          )

        if (addonsProp && isArrayExpression(addonsProp.init)) {
          reportUninstalledAddons(addonsProp.init)
        }
      },
    }
  },
})
