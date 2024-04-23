<template><div /></template>

<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const { loginIDP } = await useAuthentication('login')

onMounted(async () => {
  await loginIDP(props.code)
})
</script>
