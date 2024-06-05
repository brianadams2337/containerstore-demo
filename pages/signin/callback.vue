<template>
  <IDPCallback v-if="idpCode" :code="idpCode" />
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { isString } from 'radash'
import { useRoute } from '#app/composables/router'

const route = useRoute()

const idpCode = computed(() => {
  const code = route.query.code
  return isString(code) ? code : undefined
})

defineOptions({ name: 'CallbackPage' })
</script>
