<template>
  <IDPCallback v-if="idpCode" :code="idpCode" />
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useRoute } from '#app/composables/router'
import IDPCallback from '~/components/auth/IDPCallback.vue'

const route = useRoute()

const idpCode = computed(() => {
  const code = route.query.code
  return typeof code === 'string' ? code : undefined
})

defineOptions({ name: 'CallbackPage' })
</script>
