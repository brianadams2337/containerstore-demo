import type { RouterConfig } from 'nuxt/schema'
import { wait } from '@scayle/storefront-nuxt'
import { useNuxtApp } from '#app'
import { useRouteBaseName } from '#imports'
import { routeList } from '~/utils'

export default {
  scrollBehaviorType: 'smooth',
  scrollBehavior: (to, from, savedPosition) => {
    const nuxtApp = useNuxtApp()
    const baseName = useRouteBaseName()

    // If history back
    if (savedPosition) {
      // Handle Suspense resolution
      return new Promise((resolve) => {
        nuxtApp.hooks.hookOnce('page:finish', async () => {
          await wait(50)
          resolve(savedPosition)
        })
      })
    }

    // Scroll to heading on click
    if (!to.hash) {
      if (to.path === from.path && baseName(to) !== routeList.home.name) {
        return
      }
      return { top: 0 }
    }

    const el = document.querySelector(to.hash)
    return new Promise((resolve) => {
      if (to.path === from.path) {
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        resolve(wait(50).then(() => undefined))
        return
      }
      nuxtApp.hooks.hookOnce('page:finish', async () => {
        await wait(50)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        resolve(undefined)
      })
    })
  },
} satisfies RouterConfig
