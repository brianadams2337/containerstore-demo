import type { Nuxt } from 'nuxt/schema'
import { installModule, createResolver, addImportsDir } from '@nuxt/kit'
import { isPackageExists } from 'local-pkg'
import type { ModuleOptions } from '../../types'

export async function setupStoryblok(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  if (
    !nuxt.options.modules.includes('@storybook/nuxt') ||
    !isPackageExists('@storybook/nuxt')
  ) {
    await installModule('@storyblok/nuxt')
  }
  nuxt.options.storyblok = {
    accessToken: options.accessToken ?? '',
    enableSudoMode: options.enableSudoMode ?? false,
    usePlugin: options.usePlugin ?? false,
    bridge: options.bridge,
    devtools: options.devtools! ?? false,
    apiOptions: options.apiOptions ?? {},
    componentsDir: options.componentsDir ?? '',
  }

  addImportsDir(resolver.resolve('./composables'))

  await addComponentsDir({
    path: resolver.resolve('./components'),
  })

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: resolver.resolve('./types/storyblok.d.ts') })
  })
}
