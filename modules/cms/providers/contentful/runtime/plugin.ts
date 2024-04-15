import contentful, { createClient } from 'contentful'
import type { AxiosAdapter } from 'axios'
import type { ContentfulRuntimeConfig } from '../types'
import axiosFetchAdapter from './../utils/axiosFetchAdapter'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
export default defineNuxtPlugin({
  name: 'cms:contentful',
  setup() {
    const config = useRuntimeConfig()
    const cms = config.public.cms as ContentfulRuntimeConfig
    const createClientFunc =
      process.env.NODE_ENV === 'development'
        ? createClient
        : contentful.createClient
    const client = createClientFunc({
      accessToken:
        cms.accessToken ?? import.meta.env.NUXT_PUBLIC_CMS_ACCESS_TOKEN,
      space: cms.space ?? import.meta.env.NUXT_PUBLIC_CMS_SPACE,
      adapter: axiosFetchAdapter as AxiosAdapter,
    })
    return {
      provide: {
        contentful: client,
      },
    }
  },
})
