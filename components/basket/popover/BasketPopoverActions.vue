<template>
  <div class="flex flex-col space-y-2 border-t border-gray-200 p-4">
    <SFButton type="primary" :to="checkoutOrHomeRoute" class="w-full">
      {{ $t('basket.checkout_label') }}
    </SFButton>
    <SFButton type="secondary" :to="routeList.basket" class="w-full">
      {{ $t('basket.heading') }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = await useUser()

const checkoutOrHomeRoute = computed(() => {
  return isLoggedIn.value ? routeList.checkout : routeList.signin
})
</script>
