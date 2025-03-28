<template>
  <SFAsyncDataWrapper :status="status">
    <template v-if="user">
      <SFHeadline
        class="mb-6 !font-semi-bold-variable"
        tag="h2"
        data-testid="user-profile-headline"
      >
        {{ $t('my_account.profile.title') }}
      </SFHeadline>
      <div class="mb-6 flex flex-col gap-2 text-md text-gray-600">
        <span class="font-semibold">
          {{ $t('my_account.profile.greeting', { firstName: user.firstName }) }}
        </span>
        <p>
          {{ $t('my_account.profile.description') }}
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SFProfileAccountInformation :user="user" class="col-span-full" />
        <SFProfilePersonalInformation />
        <SFProfilePasswordManagement />
      </div>
    </template>
    <template #loading>
      <SFProfileSkeletonLoader />
    </template>
  </SFAsyncDataWrapper>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useUser } from '#storefront/composables'
import { useI18n } from '#i18n'
import { SFHeadline } from '#storefront-ui/components'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import SFProfileSkeletonLoader from '~/components/profile/SFProfileSkeletonLoader.vue'
import SFProfileAccountInformation from '~/components/profile/SFProfileAccountInformation.vue'
import SFProfilePersonalInformation from '~/components/profile/SFProfilePersonalInformation.vue'
import SFProfilePasswordManagement from '~/components/profile/SFProfilePasswordManagement.vue'

const { t } = useI18n()

const { status, user } = useUser()

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('my_account.profile.meta.title'),
  description: t('my_account.profile.meta.description'),
})

defineOptions({ name: 'UserAccountDetailsPage' })
definePageMeta({ pageType: 'account_area:user' })
</script>
