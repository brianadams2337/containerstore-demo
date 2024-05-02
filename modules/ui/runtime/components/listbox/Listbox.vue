<template>
  <div ref="listboxRef">
    <slot :is-open="isOpen" :list="name" />
  </div>
</template>

<script lang="ts" setup generic="ListboxItem extends { disabled?: boolean }">
import { watch, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useListbox } from '#storefront-ui'

type Props = {
  name: string
  beforeInput?: (value: ListboxItem) => boolean
}

const props = withDefaults(defineProps<Props>(), { beforeInput: () => true })

const emit = defineEmits<{ input: [ListboxItem]; 'click:outside': [] }>()

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
