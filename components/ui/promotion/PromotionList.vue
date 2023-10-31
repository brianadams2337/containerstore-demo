<template>
  <SlideInFromTopTransition>
    <div
      v-if="isShown"
      class="fixed right-0 top-[3.25rem] z-60 hidden w-full md:block">
      <div class="relative bg-primary p-5 text-white">
        <div class="flex w-full items-start justify-center overflow-x-scroll">
          <PromotionItem
            v-for="item in items"
            :key="item.id"
            v-bind="item"
            class="mr-4" />
        </div>
        <ClosePromotionListButton />
      </div>
    </div>
  </SlideInFromTopTransition>
  <Overlay v-if="isShown" />
</template>

<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<Promotion[]>,
    required: true,
  },
})

const { isPromotionListShown: isShown, togglePromotionList: toggle } =
  usePromotionActions()

onServerPrefetch(() => props.items.length > 1 && toggle())
</script>
