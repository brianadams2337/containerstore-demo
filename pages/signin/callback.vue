<template>
  <IDPCallback v-if="idpCode" :code="idpCode" />
</template>

<script setup lang="ts">
const route = useRoute()

const idpCode = computed(() => {
  const code = route.query.code
  return isString(code) ? code : undefined
})
</script>
