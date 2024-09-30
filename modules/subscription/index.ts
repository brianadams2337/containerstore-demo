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
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    await addComponentsDir({
      path: resolve('./components'),
      global: true,
    })

    addImportsDir(resolve('./composables'))
    addImportsDir(resolve('./helpers'))

    nuxt.options.alias['#storefront-subscription'] = resolve('./')

    extendPages((pages) => {
      pages.push({
        name: 'subscription-overview',
        path: options.overviewPagePath ?? '/account/subscription',
        file: resolve('./pages/subscription.vue'),
      })
    })

    extendPages((pages) => {
      pages.push({
        name: 'subscription-cancellations',
        path:
          options.cancellationPagePath ?? '/account/subscription-cancellations',
        file: resolve('./pages/subscription-cancellations.vue'),
      })
    })
  },
})
