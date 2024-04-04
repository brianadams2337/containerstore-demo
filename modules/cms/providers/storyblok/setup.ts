import type { Nuxt } from '@nuxt/schema'
import {
  installModule,
  createResolver,
  addImportsDir,
  addComponentsDir,
} from '@nuxt/kit'
import { type ModuleOptions } from '@storyblok/nuxt'
import type { ModuleOptions as CMSModuleOptions } from '../../types'
export async function setupStoryblok(options: CMSModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  await import('./schema')
  if (!nuxt.options.modules.includes('@storyblok/nuxt')) {
    await installModule('@storyblok/nuxt', { componentsDir: '' })
  }

  if (!nuxt.options.storyblok) {
    nuxt.options.storyblok = {} as ModuleOptions
  }
  nuxt.options.storyblok = {
    ...nuxt.options.storyblok,
    componentsDir: '',
  }

  addImportsDir(resolver.resolve('./composables'))

  await addComponentsDir({
    path: resolver.resolve('./components'),
    global: true,
  })

  nuxt.hook('prepare:types', ({ references }) => {
    references.push(
      { path: resolver.resolve('./types/storyblok.d.ts') },
      { path: resolver.resolve('./types/storyblok.gen.d.ts') },
    )
  })
}
