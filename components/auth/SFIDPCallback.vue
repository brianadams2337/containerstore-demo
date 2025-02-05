<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthentication } from '~/composables/useAuthentication'

const { code } = defineProps<{ code: string }>()

const { loginIDP } = useAuthentication('login')

onMounted(async () => {
  await loginIDP(code)
})
</script>
