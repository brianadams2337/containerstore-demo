import {
  addComponentsDir,
  createResolver,
  defineNuxtModule,
  addImportsDir,
} from '@nuxt/kit'

export type ModuleOptions = {
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-ui',
    configKey: 'storefront-ui',
    version: '0.1.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.10',
    },
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/helpers'))

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      global: true, // TODO: Remove this after we move to the `explicit` imports
      prefix: options.prefix ?? 'SF',
    })

    nuxt.options.alias['#storefront-ui'] = resolve('./runtime')
    nuxt.options.alias['#storefront-ui/components'] = resolve(
      './runtime/components',
    )
  },
})
