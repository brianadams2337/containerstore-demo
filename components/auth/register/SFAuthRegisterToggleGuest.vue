<template>
  <div
    class="flex flex-col pt-2"
    :class="isGuestEnabled ? 'pb-[2.325rem]' : 'pb-2'"
  >
    <SFSwitch
      id="guest-switch"
      v-model="isGuestEnabled"
      :label="$t('sign_in_page.guest_login.label')"
      class="mb-4"
    />
    <div
      v-if="isGuestEnabled"
      class="flex items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 py-2.5"
      data-testid="register-guest-info"
    >
      <span class="text-xs font-variable text-gray-600">
        {{ $t('sign_in_page.guest_login.activation_hint') }}
      </span>
      <IconInfoOutlineSquare class="size-4 text-gray-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSwitch } from '#storefront-ui/components'

const isGuestEnabled = defineModel<boolean>()
</script>
