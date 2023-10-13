<template>
  <div>
    <div data-test-id="home-page-content">
      <Story v-if="data" :story="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
const data = await useAsyncStoryblok('home')

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

definePageMeta({ pageType: 'homepage' })
</script>

<script lang="ts">
export default {
  name: 'HomePage',
}
</script>
