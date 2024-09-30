<template>
  <SFButton is-full-width :disabled="isSubmitting" @click="logout()">
    {{ $t('global.sign_out') }}
  </SFButton>
</template>

<script setup lang="ts">
import { useAuthentication } from '~/composables/useAuthentication'
import { SFButton } from '#storefront-ui/components'

const { logout, isSubmitting } = useAuthentication('logout')
</script>
