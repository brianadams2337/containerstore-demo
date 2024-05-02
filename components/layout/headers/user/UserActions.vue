<template>
  <div class="relative w-64">
    <div v-if="!isGuest" class="space-y-2 p-3">
      <SFButton
        :to="routeList.user"
        type="secondary"
        class="w-full"
        @click="closeUserFlyout"
      >
        {{ $t('my_account.profile_menu') }}
      </SFButton>
      <SFButton
        :to="routeList.orders"
        type="secondary"
        class="w-full"
        @click="closeUserFlyout"
      >
        {{ $t('my_account.orders_menu') }}
      </SFButton>
      <SFButton
        :to="routeList.subscriptionOverview"
        type="secondary"
        class="w-full"
        @click="closeUserFlyout"
      >
        {{ $t('my_account.subscriptions_menu') }}
      </SFButton>
    </div>
    <div
      class="flex flex-wrap items-center justify-center bg-secondary-450 p-3"
    >
      <span v-if="user" class="mr-1 break-all text-xs text-secondary">
        {{ $t('global.you_are_not_user', { name: user.firstName }) }}
      </span>
      <p
        class="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-xs font-semibold leading-5 tracking-wide"
        @click="!isSubmitting && logout()"
      >
        {{ $t('global.sign_out') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { closeUserFlyout } = useFlyouts()
const { user } = await useUser()
const { logout, isSubmitting } = await useAuthentication('logout')

const isGuest = computed(() => user.value?.status?.isGuestCustomer)
</script>
