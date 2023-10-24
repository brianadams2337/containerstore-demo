<template>
  <div
    v-if="data"
    class="sticky flex h-[3.25rem] items-center justify-between gap-1 bg-blue px-4 py-2 text-sm text-white">
    <PromotionCountdown
      :key="firstPromotion.id"
      :until="firstPromotion.schedule.to" />
    <PromotionHeadlineButton :title="firstPromotion.customData.headerText" />
    <PromotionProgressBar />
  </div>
  <PromotionList :items="data.entities" />
</template>

<script setup lang="ts">
const { data } = await useCurrentPromotions()
console.log({ data })

const firstPromotion = computed(() => data.value.entities[0])
</script>
