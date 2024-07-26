<template>
  <div class="border-0 border-b border-gray-350 bg-secondary-450 px-5">
    <div v-if="!user" class="flex justify-center py-1">
      <div class="flex space-x-1 text-center font-semibold">
        <SFLink :to="routeList.signin" @click="closeSideNavigation">
          {{ $t('global.sign_in') }}
        </SFLink>
        <span>/</span>
        <SFLink :to="routeList.signup" @click="closeSideNavigation">
          {{ $t('global.register') }}
        </SFLink>
      </div>
    </div>
    <div v-else class="flex flex-wrap items-center justify-between py-2">
      <div class="break-all py-1 text-xs font-semibold text-primary">
        {{ $t('global.user_greeting', { name: user.firstName }) }}
      </div>
      <div class="text-xs font-medium text-primary">
        <SFButton
          v-if="isGuest"
          type="raw"
          class="text-xs"
          @click="!isSubmitting && logout()"
        >
          {{ $t('global.sign_out') }}
        </SFButton>
        <SFLink v-else :to="routeList.account" @click="closeSideNavigation">
          <div class="inline-flex items-center">
            <IconUserSecondary class="mr-1 size-3" />
            <span class="font-medium">{{ $t('navigation.my_account') }}</span>
          </div>
        </SFLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthentication, useSideNavigation } from '~/composables'
import { useUser } from '#storefront/composables'
import { routeList } from '~/utils/route'

const { user } = useUser()
const { closeSideNavigation } = useSideNavigation()

const { logout, isSubmitting } = useAuthentication('logout')

const isGuest = computed(() => user.value?.status?.isGuestCustomer)
</script>
