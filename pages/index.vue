<template>
  <div>
    <div data-test-id="home-page-content">
      <Story v-if="data" :story="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
const data = await useAsyncStoryblok('home')

definePageMeta({
  pageType: 'HomePage',
})
</script>

<script lang="ts">
export default {
  name: 'HomePage',
}
</script>
