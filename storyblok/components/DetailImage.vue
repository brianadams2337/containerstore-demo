<template>
  <div v-if="blok" v-editable="blok">
    <StoryblokLink :to="`${route.path}/${blok._uid}`">
      <NuxtPicture
        class="picture picture-contain w-full sm:block"
        provider="storyblok"
        :src="blok.image.filename"
        :alt="blok.image.alt"
        :sizes="sizes" />
    </StoryblokLink>
  </div>
</template>

<script setup lang="ts">
import type { SbDetailImage } from '~/storyblok/types/storyblok'

defineProps({
  blok: {
    type: Object as PropType<SbDetailImage>,
    required: true,
  },
  sizes: {
    type: String,
    default: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
  },
})
const route = useRoute()
</script>
