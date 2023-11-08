<template>
  <SlideInFromTopTransition>
    <div
      v-if="isPromotionListShown"
      class="fixed right-0 top-[3.25rem] z-60 hidden w-full lg:block"
    >
      <div class="relative bg-primary p-5 text-white">
        <div class="flex w-full items-start justify-center overflow-x-scroll">
          <PromotionItem
            v-for="item in items"
            :key="item.id"
            v-bind="item"
            class="mr-4"
          />
        </div>
        <ClosePromotionListButton />
      </div>
    </div>
  </SlideInFromTopTransition>
</template>

<script setup lang="ts">
defineProps<{ items: Promotion[] }>()

const { isPromotionListShown } = usePromotionActions()
</script>
