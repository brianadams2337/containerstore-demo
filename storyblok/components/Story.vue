<template>
  <div>
    <StoryblokComponent :blok="story.content" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  story: {
    type: Object as PropType<{ [key: string]: any }>,
    required: true,
  },
})

console.log({
  component: props.story?.content?.content[7],
})
</script>
