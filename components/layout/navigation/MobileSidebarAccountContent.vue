<template>
  <div class="border-0 border-b border-gray-350 bg-secondary-450 px-5">
    <div v-if="!user" class="flex justify-center py-1">
      <div class="flex space-x-1 text-center font-semibold">
        <DefaultLink
          type="normal"
          :to="routeList.signin"
          @click="closeSideNavigation">
          {{ $t('global.sign_in') }}
        </DefaultLink>
        <span>/</span>
        <DefaultLink
          type="normal"
          :to="routeList.signin"
          @click="closeSideNavigation">
          {{ $t('global.register') }}
        </DefaultLink>
      </div>
    </div>
    <div v-else class="flex flex-wrap items-center justify-between py-2">
      <div class="break-all py-1 text-xs font-semibold text-primary">
        {{ $t('global.user_greeting', { name: user.firstName }) }}
      </div>
      <div v-if="!isGuest" class="text-xs font-medium text-primary">
        <DefaultLink
          :to="routeList.account"
          type="normal"
          @click="closeSideNavigation">
          <div class="inline-flex items-center">
            <IconUserSecondary class="mr-1 h-3 w-3" />
            <span class="font-medium">{{ $t('navigation.my_account') }}</span>
          </div>
        </DefaultLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = await useUser()
const { closeSideNavigation } = useUiState()

const isGuest = computed(() => user.value?.status?.isGuestCustomer)
</script>
