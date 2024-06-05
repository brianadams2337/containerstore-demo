import { sleep } from 'radash'
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehaviorType: 'smooth',
  scrollBehavior: (to, from, savedPosition) => {
    const nuxtApp = useNuxtApp()

    // If history back
    if (savedPosition) {
      // Handle Suspense resolution
      return new Promise((resolve) => {
        nuxtApp.hooks.hookOnce('page:finish', async () => {
          await sleep(50)
          resolve(savedPosition)
        })
      })
    }
    // Scroll to heading on click
    if (!to.hash) {
      return { top: 0 }
    }

    const el = document.querySelector(to.hash)
    return new Promise((resolve) => {
      if (to.path === from.path) {
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        resolve(sleep(50).then(() => undefined))
        return
      }
      nuxtApp.hooks.hookOnce('page:finish', async () => {
        await sleep(50)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        resolve(undefined)
      })
    })
  },
}
