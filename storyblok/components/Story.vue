<template>
  <div>
    <StoryblokComponent :blok="story.content?.content[0]" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['story'])
</script>

<style lang="scss" scoped></style>
