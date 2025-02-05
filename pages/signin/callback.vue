<template>
  <div v-if="idpCode" />
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted } from 'vue'
import { useRoute } from '#app/composables/router'
import { useAuthentication } from '~/composables'

const route = useRoute()

const { loginIDP } = useAuthentication('login')

const idpCode = computed(() => {
  const code = route.query.code
  return typeof code === 'string' ? code : undefined
})

onMounted(async () => {
  if (!idpCode.value) {
    return
  }
  await loginIDP(idpCode.value)
})

defineOptions({ name: 'CallbackPage' })
</script>
