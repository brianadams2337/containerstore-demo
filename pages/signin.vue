<template>
  <SignInForm />
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()

useSeoMeta({ robots: 'index,follow', title: $i18n.t('navigation.sign_in') })

defineOptions({ name: 'SigninPage' })
definePageMeta({ pageType: 'signin_page' })
</script>
