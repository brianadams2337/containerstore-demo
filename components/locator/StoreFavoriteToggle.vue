<template>
  <button
    v-if="isFavoriteStore"
    class="cursor-pointer"
    @click="favoriteStoreId = null"
  >
    <IconSelectionActive class="size-4" />
  </button>
  <button v-else class="cursor-pointer" @click="favoriteStoreId = storeId">
    <IconSelection class="size-4" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  storeId: number
}

const props = defineProps<Props>()
const favoriteStoreId = useFavoriteStore()
const isFavoriteStore = computed(() => favoriteStoreId.value === props.storeId)
</script>
