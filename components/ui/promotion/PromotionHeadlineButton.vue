<template>
  <AppButton
    type="raw"
    class="flex items-center text-white"
    @click="togglePromotionList()">
    <Headline tag="h1" size="lg">{{ title }}</Headline>
    <IconInfoOutline class="ml-2 h-5 w-5" />
  </AppButton>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
})

const { togglePromotionList } = usePromotionActions()
</script>
