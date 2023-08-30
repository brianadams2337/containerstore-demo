<template>
  <div class="relative w-64">
    <div class="p-3">
      <AppButton
        type="secondary"
        class="w-full"
        :to="{ name: route.routes.signin.name }"
        @click="closeUserFlyout">
        {{ $t('global.sign_in') }}
      </AppButton>
    </div>
    <div class="flex h-10 items-center justify-center bg-secondary-450">
      <span class="mr-1 text-xs text-secondary">
        {{ $t('global.not_registered') }}
      </span>
      <AppButton
        type="ghost"
        :to="{ name: route.routes.signin.name }"
        class="text-xs font-semibold leading-5 !tracking-wide">
        {{ $t('global.register') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { closeUserFlyout } = useUiState()
</script>
