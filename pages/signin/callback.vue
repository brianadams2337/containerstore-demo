<template>
  <SFIDPCallback v-if="idpCode" :code="idpCode" />
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useRoute } from '#app/composables/router'
import SFIDPCallback from '~/components/auth/SFIDPCallback.vue'

const route = useRoute()

const idpCode = computed(() => {
  const code = route.query.code
  return typeof code === 'string' ? code : undefined
})

defineOptions({ name: 'CallbackPage' })
</script>
