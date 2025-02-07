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
      <SFButton @click="$emit('clearError')">
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
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import type { NuxtError } from '#app'
import { SFButton, SFHeadline } from '#storefront-ui/components'
import { vSanitizedHtml } from '~/directives/sanitized-html'
import { useI18n } from '#i18n'

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

const { error } = defineProps<{
  error: AppError
}>()

defineEmits<{ clearError: [] }>()

const { t } = useI18n()

const isNotFoundError = computed(() => {
  return (
    error &&
    'statusCode' in error &&
    error?.statusCode === HttpStatusCode.NOT_FOUND
  )
})
const title = computed(() => {
  return isNotFoundError.value
    ? t('error.not_found_code')
    : t('error.not_found_message')
})

const userMessage = computed(() => {
  return isNotFoundError.value
    ? t('error.page_does_not_exist')
    : t('error.request_not_processed')
})

const isInDevMode = import.meta.dev

const statusCode = error instanceof Error ? undefined : error?.statusCode

const statusMessage =
  error instanceof Error ? error?.message : error?.statusMessage

const stack = error && 'stack' in error && error?.stack

const errorMessage = error && 'message' in error && error.message

useHead({ title: title.value })
</script>
