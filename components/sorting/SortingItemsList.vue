<template>
  <ul>
    <li v-for="item in listItems" :key="item.name" data-test-id="sorting-option">
      <DefaultLink
        type="whisper"
        :only-exact-active="true"
        :class="{
          'font-bold text-gray-800': item.name === selected,
        }"
        :to="item.target"
        @click="emit('click:item', item)">
        {{ $t(`sorting_select.${item.name}`) }}
      </DefaultLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { SortValue } from '@scayle/storefront-nuxt'
const route = useRoute()
const baseName = useRouteBaseName()


const props = defineProps({
  items: {
    type: Array as PropType<SortValue[]>,
    required: true,
  },
  selected: {
    type: String,
    default: '',
  },
})

const listItems = computed(() => {
  return props.items.map((item) => ({
    ...item,
    target: {
      name: baseName(route),
      params: { ...route.params },
      query: { ...route.query, sort: item.query },
    },
  }))
})

const emit = defineEmits<{
  (e: 'click:item', value: SortValue): void
}>()
</script>
