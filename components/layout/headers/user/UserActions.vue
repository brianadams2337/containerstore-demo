<template>
  <div class="relative w-64">
    <div v-if="!isGuestCustomer" class="space-y-2 p-3">
      <AppButton
        :to="{ name: route.routes.user.name }"
        type="secondary"
        class="w-full"
        @click="closeUserFlyout">
        {{ $t('my_account.profile_menu') }}
      </AppButton>
      <AppButton
        :to="{ name: route.routes.order.name }"
        type="secondary"
        class="w-full"
        @click="closeUserFlyout">
        {{ $t('my_account.orders_menu') }}
      </AppButton>
    </div>
    <div
      class="flex flex-wrap items-center justify-center bg-secondary-450 p-3">
      <span v-if="user" class="mr-1 break-all text-xs text-secondary">
        {{ $t('global.you_are_not_user', { name: user.firstName }) }}
      </span>
      <p
        class="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-xs font-semibold leading-5 tracking-wide"
        @click="!isSubmitting && logout()">
        {{ $t('global.sign_out') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useAuthentication } from '~/composables/useAuthentication'

const { closeUserFlyout } = useUiState()
// const { user } = useUser()
// const { logout, isSubmitting } = useAuthentication('logout')

// TODO: clarify what we want to do with this component for guest customers
// const isGuestCustomer = computed(() => user.value?.status?.isGuestCustomer)

const user = { firstName: 'John' }
const isGuestCustomer = false
const isSubmitting = false
const logout = () => {}
</script>
