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
  addImportsDir(resolver.resolve('./composables'))
}
