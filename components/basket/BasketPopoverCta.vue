<template>
  <div class="flex flex-col space-y-2 border-t border-gray-200 p-4">
    <AppButton type="primary" :to="checkoutOrHomeRoute" class="w-full">
      {{ $t('basket.checkout_label') }}
    </AppButton>
    <AppButton
      type="secondary"
      :to="{ name: routeList.basket.name }"
      class="w-full">
      {{ $t('basket.heading') }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = await useUser()

const checkoutOrHomeRoute = computed(() => ({
  name: isLoggedIn.value ? routeList.checkout.name : routeList.signin.name,
}))
</script>
