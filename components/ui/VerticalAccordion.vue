<template>
  <div class="mx-auto max-w-[33.75rem]">
    <div
      v-for="(tab, index) in tabs"
      :key="`accordion-tab-${index}`"
      class="flex flex-col gap-3.5 border p-3.5 first:rounded-t last:rounded-b"
      :class="getClasses(index)"
      @click="activeIndex = index"
    >
      <div class="text-sm" :class="{ 'font-bold': activeIndex === index }">
        {{ tab }}
      </div>

      <slot
        v-if="index === activeIndex"
        :name="index"
        :activate-tab="changeActiveTab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  tabs: {
    type: Array<string>,
    default: () => [],
  },
})

const activeIndex = ref(0)

const changeActiveTab = (value: number) => {
  activeIndex.value = value
}

const getClasses = (tabIndex: number) => ({
  'border-black bg-secondary-100': activeIndex.value === tabIndex,
  'border-gray-600': activeIndex.value !== tabIndex,
  'border-b-0': activeIndex.value > tabIndex,
  'border-t-0': activeIndex.value < tabIndex,
  'cursor-pointer': activeIndex.value !== tabIndex,
})
</script>
