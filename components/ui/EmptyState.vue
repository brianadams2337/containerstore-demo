<template>
  <div
    class="flex flex-col items-center justify-center gap-10 rounded bg-gray-50 py-10 md:flex-row md:px-10 lg:py-32">
    <div class="w-32">
      <IconCard1 v-if="icon === 'card-1'" class="w-full" />
      <IconCard2 v-if="icon === 'card-2'" class="w-full" />
    </div>
    <div class="px-8 text-center md:w-[32rem] md:px-0 md:text-start">
      <Headline v-if="title" class="!block" size="xl" :is-uppercase="false">
        {{ title }}
      </Headline>
      <Headline
        v-if="description"
        size="sm"
        :is-uppercase="false"
        class="mt-4 !block text-gray-700">
        {{ description }}
      </Headline>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'card-1',
  },
})
</script>
