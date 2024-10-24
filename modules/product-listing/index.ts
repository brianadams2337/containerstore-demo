import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

type ModuleOptions = {
  autoImports?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-product-listing',
    configKey: 'product-listing',
    version: '1.0.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.10',
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['#storefront-product-listing'] = resolve(
      './runtime/composables',
    )

    if (options.autoImports) {
      addImportsDir(resolve('./runtime/composables'))
    }
  },
})
