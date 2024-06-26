<template>
  <AccountWrapper
    :title="$t('my_account.profile_menu')"
    is-account-page
    class="mb-6"
  >
    <SFHeadline class="hidden md:block" size="xl" tag="h3">
      {{ $t('my_account.profile_menu') }}
    </SFHeadline>
    <UserPersonalInfoForm />
    <UpdatePasswordForm />
  </AccountWrapper>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useNuxtApp } from '#app/nuxt'

const { $i18n } = useNuxtApp()

useSeoMeta({
  robots: 'index,follow',
  title: $i18n.t('navigation.user_settings'),
})

defineOptions({ name: 'UserAccountDetailsPage' })
definePageMeta({ pageType: 'account_area:user' })
</script>
