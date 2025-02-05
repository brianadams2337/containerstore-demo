<template>
  <ClientOnly>
    <SFAsyncDataWrapper v-if="!isLoggedIn" :status="status">
      <div
        class="m-auto flex max-w-112 flex-col items-start justify-center pt-10 max-lg:px-4"
      >
        <div class="mb-7 flex w-full items-center justify-between">
          <SFHeadline class="!leading-6 text-gray-900 max-lg:!text-xl" tag="h1">
            {{ $t('sign_in_page.welcome_back_title') }}
          </SFHeadline>
          <IconScreenClick class="size-9 max-lg:hidden" />
        </div>
        <SFAuthTabs class="border-b border-b-gray-200 pb-4" />
      </div>
    </SFAsyncDataWrapper>
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useI18n } from '#i18n'
import { SFHeadline } from '#storefront-ui/components'
import { ClientOnly } from '#components'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import { useUser } from '#storefront/composables'
import SFAuthTabs from '~/components/auth/SFAuthTabs.vue'

const { t } = useI18n()

const { isLoggedIn, status } = useUser()

useSeoMeta({ robots: 'index,follow', title: t('navigation.sign_in') })

defineOptions({ name: 'SigninPage' })
definePageMeta({ pageType: 'signin_page' })
</script>
