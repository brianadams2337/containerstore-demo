<template>
  <div>
    <div
      v-for="item in sortedItems"
      :key="item.value"
      class="flex items-start break-all"
    >
      <slot
        name="item"
        v-bind="{
          item,
          toggleItem,
          selectItem,
          deselectItem,
          isActive: isActive(item),
        }"
      />
    </div>
    <SFButton
      v-if="limit != null && !showAll && items.length > limit"
      size="sm"
      type="ghost"
      class="mr-auto py-0 text-xs font-semibold text-secondary"
      @click="showAll = true"
    >
      {{ $t('filter.show_all') }}
    </SFButton>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="Item extends { value: string | number; [key: string]: any }"
>
import { computed, ref } from 'vue'

type Props = {
  name: string
  items?: Item[]
  modelValue?: Item[]
  limit?: number
  selectedFirst?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  modelValue: () => [],
  limit: undefined,
  selectedFirst: false,
})

const emit = defineEmits<{ 'update:model-value': [Item[]] }>()

const selected = computed({
  get: () => props.modelValue as Item[],
  set: (newValue: Item[]) => emit('update:model-value', newValue),
})

const toggleItem = (item: Item) => {
  !isActive(item) ? selectItem(item) : deselectItem(item)
}

const isActive = (item: Item): boolean => {
  return selected.value.findIndex((i) => i.value === item.value) !== -1
}

const selectItem = (item: Item) => {
  selected.value.push(item)
}

const deselectItem = (item: Item) => {
  const index = selected.value.findIndex((i) => i.value === item.value)

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
