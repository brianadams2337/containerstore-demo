<template>
  <div
    class="container mt-10 flex flex-col items-center justify-center text-primary">
    <section class="flex flex-col items-center">
      <Headline>{{ title }}</Headline>
      <Headline class="mt-2" size="sm" tag="h2">{{ message }}</Headline>
    </section>
    <section class="mt-6">
      <AppButton @click="clearError({ redirect })">
        {{ $t('error.continue_shopping') }}
      </AppButton>
    </section>
  </div>
</template>

<script setup lang="ts">
import { HttpStatusCode } from '@scayle/storefront-nuxt'

const error = useError()
const { $i18n } = useNuxtApp()

const isNotFoundError = computed(() => {
  return (
    error?.value &&
    'statusCode' in error.value &&
    error.value.statusCode === HttpStatusCode.NOT_FOUND
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

useHead({ title: title.value })

const redirect = toLocalePath({ name: routeList.home.name }).toString()
</script>

<script lang="ts">
export default {
  name: 'AppError',
}
</script>
