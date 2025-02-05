<template>
  <SFSignInForm />
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useI18n } from '#i18n'
import SFSignInForm from '~/components/auth/SFSignInForm.vue'

const { t } = useI18n()

useSeoMeta({ robots: 'index,follow', title: t('navigation.sign_in') })

defineOptions({ name: 'SigninPage' })
definePageMeta({ pageType: 'signin_page' })
</script>
