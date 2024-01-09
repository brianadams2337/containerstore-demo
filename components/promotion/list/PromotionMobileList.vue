<template>
  <div
    ref="promotionList"
    class="fixed bottom-0 right-0 z-60 w-full overflow-hidden rounded-t-xl lg:hidden"
  >
    <div class="relative flex flex-col bg-primary px-4 pb-4 text-white">
      <div class="flex justify-center p-4">
        <Headline tag="h2" size="lg">
          {{ $t('promotion.my_deals_label') }} ({{ items.length }})
        </Headline>
        <ClosePromotionListButton position-class="right-5 top-4" />
      </div>
      <HorizontalItemsSlider>
        <PromotionItem
          v-for="item in items"
          :key="item.id"
          v-bind="item"
          class="mr-4 last-of-type:mr-0"
        />
      </HorizontalItemsSlider>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: Promotion[] }>()

const promotionList = ref()

const viewport = useDefaultBreakpoints()

const { togglePromotionList: toggle } = usePromotionActions()

onClickOutside(promotionList, () => viewport.isSmaller('lg') && toggle())
</script>
