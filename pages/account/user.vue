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
    <UpdatePasswordForm v-if="user?.authentication?.type !== 'idp'" />
  </AccountWrapper>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useNuxtApp } from '#app'
import { useUser } from '#storefront/composables'
import UserPersonalInfoForm from '~/components/account/UserPersonalInfoForm.vue'
import UpdatePasswordForm from '~/components/account/password/UpdatePasswordForm.vue'
import AccountWrapper from '~/components/account/AccountWrapper.vue'
import { SFHeadline } from '#storefront-ui/components'

const { user } = useUser()

const { $i18n } = useNuxtApp()

useSeoMeta({
  robots: 'index,follow',
  titleTemplate: (pageTitle) => pageTitle ?? null,
  title: $i18n.t('navigation.user_settings'),
})

defineOptions({ name: 'UserAccountDetailsPage' })
definePageMeta({ pageType: 'account_area:user' })
</script>
