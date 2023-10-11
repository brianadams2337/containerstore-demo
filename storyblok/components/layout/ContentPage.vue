<template>
  <div v-editable="blok">
    <div class="my-8">
      <Headline size="xl" tag="h1" is-uppercase>{{ blok.headline }}</Headline>
      <p class="my-8">{{ blok.subline }}</p>
    </div>
    <div v-for="content in blok.content" :key="content._uid">
      <component :is="content.component" :blok="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SbContentPage } from '~/storyblok/types/storyblok.gen'

defineProps({
  blok: {
    type: Object as PropType<SbContentPage>,
    required: true,
  },
})
</script>
