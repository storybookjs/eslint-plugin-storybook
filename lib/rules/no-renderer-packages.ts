/**
 * @fileoverview Do not import renderer packages directly in stories
 * @author Norbert de Langen
 */

import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'
import { TSESTree } from '@typescript-eslint/utils'

const rendererPackages: Record<string, string> = {
  '@storybook/html': 'html',
  '@storybook/polymer': 'polymer',
  '@storybook/preact': 'preact',
  '@storybook/react': 'react',
  '@storybook/server': 'server',
  '@storybook/svelte': 'svelte',
  '@storybook/vue': 'vue',
  '@storybook/vue3': 'vue3',
  '@storybook/web-components': 'web-components',
}

const frameworkPackages: Record<string, string> = {
  '@storybook/experimental-nextjs-vite': 'experimental-nextjs-vite',
  '@storybook/html-vite': 'html-vite',
  '@storybook/html-webpack5': 'html-webpack5',
  '@storybook/nextjs': 'nextjs',
  '@storybook/preact-vite': 'preact-vite',
  '@storybook/preact-webpack5': 'preact-webpack5',
  '@storybook/react-native-web-vite': 'react-native-web-vite',
  '@storybook/react-vite': 'react-vite',
  '@storybook/react-webpack5': 'react-webpack5',
  '@storybook/server-webpack5': 'server-webpack5',
  '@storybook/svelte-vite': 'svelte-vite',
  '@storybook/svelte-webpack5': 'svelte-webpack5',
  '@storybook/sveltekit': 'sveltekit',
  '@storybook/vue3-vite': 'vue3-vite',
  '@storybook/vue3-webpack5': 'vue3-webpack5',
  '@storybook/web-components-vite': 'web-components-vite',
  '@storybook/web-components-webpack5': 'web-components-webpack5',
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

type MessageIds = 'noRendererPackages'
type Options = readonly []

export = createStorybookRule<Options, MessageIds>({
  name: 'no-renderer-packages',
  defaultOptions: [] as const,
  meta: {
    type: 'problem',
    severity: 'error',
    docs: {
      description: 'Do not import renderer packages directly in stories',
      categories: [CategoryId.RECOMMENDED],
    },
    schema: [],
    messages: {
      noRendererPackages:
        'Do not import renderer package "{{rendererPackage}}" directly. Use a framework package instead (e.g. {{suggestions}}).',
    },
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const getSuggestedFrameworkPackages = (rendererName: string): string[] => {
      const rendererType = rendererPackages[rendererName]
      if (!rendererType) return []

      return Object.entries(frameworkPackages)
        .filter(([pkg]) => pkg.includes(rendererType))
        .map(([pkg]) => pkg)
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        const packageName = node.source.value

        if (typeof packageName === 'string' && rendererPackages[packageName]) {
          const suggestions = getSuggestedFrameworkPackages(packageName)

          context.report({
            node,
            messageId: 'noRendererPackages',
            data: {
              rendererPackage: packageName,
              suggestions: suggestions.join(', '),
            },
          })
        }
      },
    }
  },
})
