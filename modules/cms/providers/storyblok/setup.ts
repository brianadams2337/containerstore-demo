import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addTypeTemplate,
  createResolver,
  installModule,
} from '@nuxt/kit'
import type { ModuleOptions as StoryblokDefaultModuleOptions } from '@storyblok/nuxt'
import type { Nuxt, NuxtOptions } from 'nuxt/schema'
import { logger } from '../../utils/helpers'
import type { StoryblokModuleOptions } from './types'
import type { ModuleOptions } from '~/modules/cms/types'

export async function setupStoryblok(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  logger.info('Setting up Storyblok provider...')

  const runtimeCMS = nuxt.options.runtimeConfig?.public.cms

  if (!nuxt.options.modules.includes('@storyblok/nuxt')) {
    await installModule('@storyblok/nuxt', { componentsDir: '' })
  }

  if (!nuxt.options.storyblok) {
    nuxt.options.storyblok = {} as StoryblokDefaultModuleOptions
  }
  nuxt.options.storyblok = {
    ...nuxt.options.storyblok,
    componentsDir: '',
  }

  nuxt.options.image = {
    ...nuxt.options.image,
    domains: ['https://a.storyblok.com'],
    storyblok: {
      baseURL: 'https://a.storyblok.com',
      modifiers: {
        // set default quality as modifier. This will force also storyblok to use webp if the client supports it.
        // Setting the format via the format modifier will force the format even when it's not supported by the client.
        quality: '85',
      },
    },
  } as NuxtOptions['image']

  logger.info('Checking up Storyblok credentials...')
  if (
    runtimeCMS.accessToken === undefined &&
    !import.meta.env.NUXT_PUBLIC_CMS_ACCESS_TOKEN
  ) {
    logger.error('Missing Storyblok accessToken')
  }

  logger.info('Loading up Storyblok plugin...')
  addPlugin(resolver.resolve('./runtime/plugin'))

  logger.info('Loading up Storyblok composables...')
  addImportsDir(resolver.resolve('./composables'))
  addImportsDir(resolver.resolve('./composables/storefront'))

  nuxt.options.alias['#storefront-cms/composables'] =
    resolver.resolve('./components')

  logger.info('Loading up Storyblok components...')
  await addComponentsDir({
    path: resolver.resolve('./components'),
    prefix: options.componentPrefix ?? 'CMS',
    pathPrefix: false,
    global: true,
  })

  logger.info('Loading up Storyblok types...')
  addTypeTemplate({
    filename: 'cms-custom.d.ts',
    src: resolver.resolve('./types/storyblok.d.ts'),
  })
  addTypeTemplate({
    filename: 'cms-generated.d.ts',
    src: resolver.resolve('./types/storyblok.gen.d.ts'),
  })

  addTypeTemplate({
    filename: 'cms-types.d.ts',
    src: resolver.resolve('./types/index.ts'),
  })

  addTypeTemplate({
    filename: 'storefront-cms.d.ts',
    write: true,
    getContents: () => {
      return `
      import { StoryblokRuntimeConfig } from '${resolver.resolve(
        './types/index.ts',
      )}'

      declare module '@nuxt/schema' {
        interface RuntimeConfig {
          cms: StoryblokRuntimeConfig
        }
        interface PublicRuntimeConfig {
          cms: StoryblokRuntimeConfig
        }
      }
      export {}
      `
    },
  })
}

export function isProviderStoryblok(
  options: ModuleOptions,
): options is StoryblokModuleOptions {
  return options.provider === 'storyblok'
}
