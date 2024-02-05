import type { Nuxt } from 'nuxt/schema'
import {
  installModule,
  createResolver,
  addImportsDir,
  addComponentsDir,
} from '@nuxt/kit'
import type { ModuleOptions as CMSModuleOptions } from '../../types'
export async function setupStoryblok(options: CMSModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  await import('./schema')
  if (!nuxt.options.modules.includes('@storybook/nuxt')) {
    await installModule('@storyblok/nuxt')
  }
  nuxt.options.storyblok = {
    accessToken: options.accessToken ?? '',
    enableSudoMode: options.enableSudoMode ?? false,
    usePlugin: options.usePlugin ?? false,
    bridge: options.bridge ?? false,
    devtools: options.devtools! ?? false,
    apiOptions: options.apiOptions ?? {},
    componentsDir: options.componentsDir ?? '',
  }

  addImportsDir(resolver.resolve('./composables'))

  await addComponentsDir({
    path: resolver.resolve('./components'),
  })

  nuxt.hook('prepare:types', ({ references }) => {
    references.push(
      { path: resolver.resolve('./types/storyblok.d.ts') },
      { path: resolver.resolve('./types/storyblok.gen.d.ts') },
    )
  })
}
