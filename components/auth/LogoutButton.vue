<template>
  <AppButton is-full-width :disabled="isSubmitting" @click="logout()">
    {{ $t('global.sign_out') }}
  </AppButton>
</template>

<script setup lang="ts">
const { logout, isSubmitting } = await useAuthentication('logout')
</script>
