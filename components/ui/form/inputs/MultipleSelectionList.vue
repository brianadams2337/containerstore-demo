<template>
  <div>
    <div v-for="item in sortedItems" :key="item.value" class="flex items-start">
      <slot
        name="item"
        v-bind="{
          item,
          toggleItem,
          selectItem,
          deselectItem,
          isActive: isActive(item),
        }" />
    </div>
    <AppButton
      v-if="limit != null && !showAll && items.length > limit"
      size="sm"
      type="ghost"
      class="text-secondary mr-auto py-0 text-xs font-semibold"
      @click="showAll = true">
      {{ $t('filter.show_all') }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
type Item = {
  value: any
  [key: string]: any
}

const props = defineProps({
  items: {
    type: Array as PropType<Item[]>,
    default: () => [],
  },
  name: {
    type: String as PropType<string>,
    required: true,
  },
  modelValue: {
    type: Array as PropType<Item[]>,
    default: () => [],
  },
  limit: {
    type: Number,
    default: null,
  },
  selectedFirst: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue as Item[],
  set: (newValue: Item[]) => emit('update:modelValue', newValue),
})

const toggleItem = (item: Item) => {
  !isActive(item) ? selectItem(item) : deselectItem(item)
}

const isActive = (item: Item): boolean => {
  return selected.value.findIndex((i) => i === item) !== -1
}

const selectItem = (item: Item) => {
  selected.value.push(item)
}

const deselectItem = (item: Item) => {
  const index = selected.value.findIndex((i) => i === item)

  if (index !== -1) {
    selected.value.splice(index, 1)
  }
}

const showAll = ref(false)

const sortedItems = computed(() => {
  const items = props.selectedFirst
    ? Array.from(props.items).sort((a, b) => {
        if (isActive(a) && !isActive(b)) {
          return -1
        } else if (!isActive(a) && isActive(b)) {
          return 1
        }
        return 0
      })
    : props.items

  return props.limit != null && !showAll.value
    ? items.slice(0, props.limit)
    : items
})
</script>
