/// <reference types="@nuxt/eslint" />

// Based on <https://github.com/antfu/nuxt-eslint-auto-explicit-import>

import { defineNuxtModule, logger } from '@nuxt/kit'
import type { Unimport } from 'unimport'

// Module options TypeScript interface definition
export type ModuleOptions = object

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'storefront-eslint-auto-explicit-import',
  },
  setup(options, nuxt) {
    let unimport: Unimport

    nuxt.hook('imports:context', (ctx) => {
      unimport = ctx
    })

    nuxt.hook('eslint:config:addons', (addons) => {
      addons.push({
        name: 'storefront-eslint-auto-explicit-import',
        async getConfigs() {
          if (!unimport) {
            logger.warn(
              'unimport is not ready for storefront-eslint-auto-explicit-import',
            )
          }

          return {
            imports: [
              {
                from: '~/modules/eslint-auto-explicit-import/src/eslint-plugin-unimport.mjs',
                name: 'createAutoInsert',
              },
            ],
            configs: [
              [
                '// storefront-eslint-auto-explicit-import',
                'createAutoInsert({',
                `  imports: ${JSON.stringify(
                  (await unimport?.getImports()) || [],
                )}`,
                '})',
              ].join('\n'),
            ],
          }
        },
      })
    })
  },
})
