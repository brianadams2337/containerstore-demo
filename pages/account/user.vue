<template>
  <SFAccountWrapper
    :title="$t('my_account.profile_menu')"
    is-account-page
    class="mb-6"
  >
    <SFHeadline class="hidden md:block" size="xl" tag="h1">
      {{ $t('my_account.profile_menu') }}
    </SFHeadline>
    <SFUserPersonalInfoForm />
    <SFUpdatePasswordForm v-if="user?.authentication?.type !== 'idp'" />
  </SFAccountWrapper>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useNuxtApp } from '#app'
import { useUser } from '#storefront/composables'
import SFUserPersonalInfoForm from '~/components/account/SFUserPersonalInfoForm.vue'
import SFUpdatePasswordForm from '~/components/account/password/SFUpdatePasswordForm.vue'
import SFAccountWrapper from '~/components/account/SFAccountWrapper.vue'
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
