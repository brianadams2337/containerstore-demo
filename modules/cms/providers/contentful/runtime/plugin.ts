import contentful, { createClient } from 'contentful'
import type { AxiosAdapter } from 'axios'
import type { ContentfulRuntimeConfig } from '../types'
import { useContentfulEditor } from '../composables/useContentfulEditor'
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

    const { isInEditorMode } = useContentfulEditor()

    const hasPreviewAccessToken = !!cms.previewAccessToken

    const host =
      isInEditorMode && hasPreviewAccessToken
        ? cms.previewHost ?? 'preview.contentful.com'
        : cms.host ?? 'cdn.contentful.com'

    const accessToken =
      isInEditorMode && hasPreviewAccessToken
        ? cms.previewAccessToken ?? ''
        : cms.accessToken

    const client = createClientFunc({
      accessToken,
      space: cms.space,
      adapter: axiosFetchAdapter as AxiosAdapter,
      host,
    })
    return {
      provide: {
        contentful: client,
      },
    }
  },
})
