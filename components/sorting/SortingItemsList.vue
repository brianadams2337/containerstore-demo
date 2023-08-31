<template>
  <ul>
    <li v-for="item in items" :key="item.name" data-test-id="sorting-option">
      <DefaultLink
        type="whisper"
        :only-exact-active="true"
        :class="{
          'font-bold text-black': item.name === selected,
        }"
        :to="{
          params: { ...$route.params },
          query: { ...$route.query, sort: item.query },
        }"
        @click.native="emit('click:item', item)"
        >{{ $t(`sorting_select.${item.name}`) }}</DefaultLink
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { SortValue } from '@scayle/storefront-nuxt'

defineProps({
  items: {
    type: Array as PropType<SortValue[]>,
    required: true,
  },
  selected: {
    type: String as PropType<string>,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'click:item', value: SortValue): void
}>()
</script>
