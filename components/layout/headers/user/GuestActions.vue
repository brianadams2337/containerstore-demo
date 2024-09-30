<template>
  <div class="relative w-64">
    <div class="p-3">
      <SFButton
        type="secondary"
        class="w-full"
        :to="routeList.signin"
        @click="closeUserFlyout"
      >
        {{ $t('global.sign_in') }}
      </SFButton>
    </div>
    <div class="flex h-10 items-center justify-center bg-secondary-450">
      <span class="mr-1 text-xs text-secondary">
        {{ $t('global.not_registered') }}
      </span>
      <SFButton
        type="raw"
        :to="routeList.signup"
        class="text-xs font-semibold leading-5 !tracking-wide"
      >
        {{ $t('global.register') }}
      </SFButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFlyouts } from '~/composables/useFlyouts'
import { routeList } from '~/utils/route'
import { SFButton } from '#storefront-ui/components'

const { closeUserFlyout } = useFlyouts()
</script>
