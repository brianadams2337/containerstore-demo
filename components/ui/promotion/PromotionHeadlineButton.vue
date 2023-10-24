<template>
  <AppButton
    type="raw"
    class="flex items-center text-white"
    @click="togglePromotionList()">
    <Headline tag="h1" size="lg">{{ title }}</Headline>
    <template #append-icon>
      <IconInfoOutline class="h-5 w-5" />
    </template>
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
