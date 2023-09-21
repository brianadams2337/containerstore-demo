<template>
  <div
    class="container mt-10 flex flex-col items-center justify-center text-primary">
    <section class="flex flex-col items-center">
      <Headline>{{ title }}</Headline>
      <Headline class="mt-2" size="sm" tag="h2">{{ message }}</Headline>
    </section>
    <section class="mt-6">
      <AppButton @click="$emit('clear-error')">
        {{ $t('error.continue_shopping') }}
      </AppButton>
    </section>
    <div v-if="isInDevMode">
      <div>{{ statusCode }} {{ statusMessage }}</div>
      <!-- eslint-disable-next-line vue/no-v-html --> 
      <code v-if="stack" v-html="stack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { NuxtError } from 'nuxt/app'
type AppError =
  | NuxtError
  | Error
  | {
      url: string
      statusCode: number
      statusMessage: string
      message: string
      description: string
      data?: any
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

const message = computed(() => {
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

useHead({ title: title.value })
</script>

<script lang="ts">
export default {
  name: 'ErrorLayout',
}
</script>
