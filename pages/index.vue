<template>
  <div>
    <div data-test-id="home-page-content">
      <pre>{{ JSON.stringify(data2) }}</pre>

      <Story v-if="data" :story="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
const storyblokOptions = useDefaultStoryblokOptions()
const data = await useAsyncStoryblok('home', storyblokOptions)

const client = useContentful()
const data2 = await client.getEntry('2cayfg7wVF5WezADCHgSgL')

const { $config } = useNuxtApp()
const route = useRoute()
useSeoMeta({
  robots: 'index,follow',
})
useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonical(`${$config.public.baseUrl}${route?.fullPath}`),
    },
  ],
})

defineOptions({ name: 'HomePage' })
definePageMeta({ pageType: 'homepage' })
</script>
