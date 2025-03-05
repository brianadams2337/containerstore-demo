<template>
  <div class="w-64">
    <div class="space-y-1 border-b border-gray-300 p-5">
      <div
        class="text-base font-semi-bold-variable"
        data-testid="greeting-user-firstname"
      >
        {{
          $t('my_account.popover.greeting', {
            firstName: user?.firstName,
          })
        }}
      </div>
      <div
        v-if="user?.email"
        class="text-sm font-variable leading-5 text-gray-600"
        data-testid="user-popover-email"
      >
        {{ user?.email }}
      </div>
    </div>
    <div v-if="!isGuest" class="border-b border-gray-300 p-2">
      <SFAccountLink
        :to="routeList.user"
        :label="$t('my_account.profile_menu')"
        icon="IconSettings"
        @click="$emit('close')"
      />
      <SFAccountLink
        :to="routeList.orders"
        :label="$t('my_account.orders_menu')"
        icon="IconBasket"
        @click="$emit('close')"
      />
      <SFAccountLink
        :to="routeList.subscriptionOverview"
        :label="$t('my_account.subscriptions_menu')"
        icon="IconCreditcard"
        @click="$emit('close')"
      />
    </div>
    <div class="p-2">
      <SFButton
        variant="raw"
        :disabled="isSubmitting"
        class="group flex w-full items-center !justify-start space-x-3 rounded-md px-3 py-2.5 hover:bg-gray-100 disabled:border-none disabled:!bg-white"
        data-testid="user-popover-logout-button"
        @click="handleLogout"
      >
        <span
          class="text-base font-variable leading-5 text-gray-600 group-hover:text-black group-disabled:!text-gray-600"
        >
          {{ $t('global.sign_out') }}
        </span>
      </SFButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFAccountLink from './SFAccountLink.vue'
import { useUser } from '#storefront/composables'
import { useAuthentication } from '~/composables'
import { routeList } from '~/utils/route'
import { SFButton } from '#storefront-ui/components'

const emit = defineEmits<{
  close: []
}>()

const { user } = useUser()
const { logout, isSubmitting } = useAuthentication('logout')

const isGuest = computed(() => user.value?.status?.isGuestCustomer)
const handleLogout = async () => {
  await logout()
  emit('close')
}
</script>
