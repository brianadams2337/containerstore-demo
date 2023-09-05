<template>
  <div>PDP: {{ name }}</div>
</template>

<script setup lang="ts">
const route = useRoute()

const name = computed(() => `${route.params.name} ${route.params.id}`)
</script>
<script lang="ts">
export default {
  name: 'ProductPage',
}
</script>
