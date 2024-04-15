<template>
  <div v-if="blok">
    <CMSStoryblokLink :to="`${route.path}/${blok.fields.uid}`">
      <NuxtPicture
        class="picture picture-contain w-full sm:block"
        provider="contentful"
        :src="blok.fields.image?.fields.file?.url"
        :alt="
          blok.fields.image?.fields.title ??
          blok.fields.image?.fields.file?.fileName
        "
        :sizes="sizes"
      />
    </CMSStoryblokLink>
  </div>
</template>

<script setup lang="ts">
import type { CMSDetailImageProps } from '~/modules/cms/providers/contentful/types'

withDefaults(defineProps<CMSDetailImageProps>(), {
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const route = useRoute()
defineOptions({ name: 'CMSDetailImage' })
</script>
