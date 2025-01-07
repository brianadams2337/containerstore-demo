<template>
  <SFSignInForm />
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useNuxtApp } from '#app'
import SFSignInForm from '~/components/auth/SFSignInForm.vue'

const { $i18n } = useNuxtApp()

useSeoMeta({ robots: 'index,follow', title: $i18n.t('navigation.sign_in') })

defineOptions({ name: 'SigninPage' })
definePageMeta({ pageType: 'signin_page' })
</script>
