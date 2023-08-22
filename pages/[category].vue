<template>
  <div>Category {{ slug }} Page</div>
</template>

<script setup lang="ts">
const { params } = useRoute()
const slug = computed(() => params.category)
</script>

<script lang="ts">
export default {
  name: 'ProductListingPage',
}
</script>
