<template>
  <div ref="listboxRef">
    <slot :is-open="isOpen" :list="name" />
  </div>
</template>

<script lang="ts" setup generic="ListboxItem extends { disabled?: boolean}">
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['input', 'click:outside'])

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  beforeInput: {
    type: Function as PropType<(value: ListboxItem) => boolean>,
    default: () => true,
  },
})
const { isOpen, activeValue, toggle } = useListbox<ListboxItem>(props.name)
const listboxRef = ref()

onClickOutside(listboxRef, () => {
  if (isOpen.value) {
    toggle()
  }
  emit('click:outside')
})

watch(activeValue, (value) => props.beforeInput(value) && emit('input', value))
</script>

<script lang="ts">
export default {
  name: 'AppListbox',
}
</script>
