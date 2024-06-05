<template>
  <IDPCallback v-if="idpCode" :code="idpCode" />
</template>

<script setup lang="ts">
import { defineOptions, computed } from 'vue'
import { useRoute } from '#app/composables/router'
import { isString } from 'radash'

const route = useRoute()

const idpCode = computed(() => {
  const code = route.query.code
  return isString(code) ? code : undefined
})

defineOptions({ name: 'CallbackPage' })
</script>
