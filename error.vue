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

const is404 = computed(() => error?.value &&'statusCode' in error.value && error.value.statusCode === 404)
    const title = computed(() =>
      is404.value ? 'Oh - 404' : 'Oh - Da ist etwas schief gelaufen',
    )
    const message = computed(() =>
      is404.value
        ? 'Diese Seite existiert leider nicht mehr.'
        : 'Deine Anfrage konnte nicht bearbeitet werden, versuch es gerne gleich nochmal.',
    )

    useHead({ title: title.value })

const redirect = toLocalePath({ name: routeList.home.name }).toString()

</script>