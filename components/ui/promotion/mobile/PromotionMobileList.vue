<template>
  <div
    ref="promotionList"
    class="fixed bottom-0 right-0 z-60 w-full overflow-hidden rounded-t-xl md:hidden">
    <div class="relative flex flex-col bg-primary px-4 pb-4 text-white">
      <div class="flex justify-center p-4">
        <Headline tag="h2" size="lg">
          {{ $t('promotion.my_deals_label') }} ({{ items.length }})
        </Headline>
        <ClosePromotionListButton position-class="right-5 top-4" />
      </div>
      <div class="flex w-full items-start justify-center overflow-x-scroll">
        <PromotionItem
          v-for="item in items"
          :key="item.id"
          v-bind="item"
          class="mr-4" />
      </div>
    </div>
  </div>
  <Overlay />
</template>

<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<Promotion[]>,
    required: true,
  },
})

const promotionList = ref()

const { togglePromotionList: toggle } = usePromotionActions()

onServerPrefetch(() => props.items.length > 1 && toggle())

onClickOutside(promotionList, () => toggle())
</script>
