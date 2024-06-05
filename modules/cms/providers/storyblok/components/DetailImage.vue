<template>
  <div v-if="blok" v-editable="blok">
    <CMSStoryblokLink :to="`${route.path}/${blok._uid}`">
      <NuxtPicture
        class="picture picture-contain w-full sm:block"
        provider="storyblok"
        :src="blok.image.filename"
        :alt="blok.image.alt"
        :sizes="sizes"
      />
    </CMSStoryblokLink>
  </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import type { CMSDetailImageProps } from '../types'
import { useRoute } from '#app/composables/router'

withDefaults(defineProps<CMSDetailImageProps>(), {
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})
const route = useRoute()
defineOptions({ name: 'CMSDetailImage' })
</script>
