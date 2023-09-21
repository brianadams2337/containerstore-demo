<template>
  <div
    class="container mt-10 flex flex-col items-center justify-center text-primary">
    <section class="flex flex-col items-center">
      <Headline>{{ title }}</Headline>
      <Headline class="mt-2" size="sm" tag="h2">
        {{ message }}
      </Headline>
    </section>
    <section class="mt-6">
      <div @click="clearError({ redirect })">
        <span class="text-sm">{{ $t('error.continue_shopping') }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const error = useError()
const { $i18n } = useNuxtApp()

const isNotFoundError = computed(() => {
  return (
    error?.value &&
    'statusCode' in error.value &&
    error.value.statusCode === 404
  )
})
const title = computed(() => {
  return isNotFoundError.value
    ? $i18n.t('not_found_code')
    : $i18n.t('not_found_message')
})

const message = computed(() => {
  return isNotFoundError.value
    ? $i18n.t('page_does_not_exist')
    : $i18n.t('request_not_processed')
})

useHead({ title: title.value })

const redirect = toLocalePath({ name: routeList.home.name }).toString()
</script>

<script>
export default {
  name: 'AppError',
}
</script>
