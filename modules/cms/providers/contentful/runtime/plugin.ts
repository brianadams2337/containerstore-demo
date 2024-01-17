import { createClient } from 'contentful' // for SSR, SSG
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const client = createClient({
    space: config.public.cms.space,
    accessToken: config.public.cms.accessToken,
  })
  return {
    provide: {
      contentful: client,
    },
  }
})
