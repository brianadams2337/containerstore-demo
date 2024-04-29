import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
  extendPages,
} from '@nuxt/kit'

type ModuleOptions = {
  overviewPagePath?: string
  cancellationPagePath?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-subscription',
    configKey: 'subscription',
    version: '1.0.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.10',
    },
  },
  async setup(option) {
    const resolver = createResolver(import.meta.url)
    await addComponentsDir({
      path: resolver.resolve('./components'),
      global: true,
    })

    addImportsDir(resolver.resolve('./composables'))
    addImportsDir(resolver.resolve('./helpers'))

    extendPages((pages) => {
      pages.push({
        name: 'subscription-overview',
        path: option.overviewPagePath ?? '/account/subscription',
        file: resolver.resolve('./pages/subscription.vue'),
      })
    })

    extendPages((pages) => {
      pages.push({
        name: 'subscription-cancellations',
        path:
          option.cancellationPagePath ?? '/account/subscription-cancellations',
        file: resolver.resolve('./pages/subscription-cancellations.vue'),
      })
    })
  },
})
