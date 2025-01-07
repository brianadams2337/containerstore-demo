<template>
  <div
    class="container mt-10 flex flex-col items-center justify-center text-primary"
  >
    <section class="flex flex-col items-center">
      <SFHeadline is-uppercase>{{ title }}</SFHeadline>
      <SFHeadline class="mt-2" size="sm" tag="h2" is-uppercase>
        {{ userMessage }}
      </SFHeadline>
    </section>
    <section class="mt-6">
      <SFButton @click="$emit('clear-error')">
        {{ $t('error.continue_shopping') }}
      </SFButton>
    </section>
    <div v-if="isInDevMode" class="max-w-full overflow-auto">
      <div>{{ statusCode }} {{ statusMessage }}</div>
      <pre class="font-bold">{{ errorMessage }}</pre>
      <code v-if="stack" v-sanitized-html="stack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import type { PropType } from 'vue'
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { useNuxtApp } from '#app'
import type { NuxtError } from '#app'
import { SFButton, SFHeadline } from '#storefront-ui/components'
import { vSanitizedHtml } from '~/directives/sanitized-html'

type AppError =
  | NuxtError
  | Error
  | {
      url: string
      statusCode: number
      statusMessage: string
      message: string
      description: string
      data?: unknown
    }
  | null
  | undefined

const props = defineProps({
  error: {
    type: Object as PropType<AppError>,
    default: undefined,
  },
})

defineEmits(['clear-error'])
const { $i18n } = useNuxtApp()

const isNotFoundError = computed(() => {
  return (
    props.error &&
    'statusCode' in props.error &&
    props.error?.statusCode === HttpStatusCode.NOT_FOUND
  )
})
const title = computed(() => {
  return isNotFoundError.value
    ? $i18n.t('error.not_found_code')
    : $i18n.t('error.not_found_message')
})

const userMessage = computed(() => {
  return isNotFoundError.value
    ? $i18n.t('error.page_does_not_exist')
    : $i18n.t('error.request_not_processed')
})

const isInDevMode = import.meta.dev
const statusCode =
  props.error instanceof Error ? undefined : props.error?.statusCode
const statusMessage =
  props.error instanceof Error
    ? props.error?.message
    : props.error?.statusMessage

const stack = props.error && 'stack' in props.error && props.error?.stack
const errorMessage =
  props.error && 'message' in props.error && props.error.message

useHead({ title: title.value })
</script>
