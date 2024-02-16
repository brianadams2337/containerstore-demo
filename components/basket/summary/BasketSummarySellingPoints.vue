<template>
  <div
    v-if="sellingPoints?.length"
    class="flex flex-col gap-2 rounded bg-secondary-450 p-4 text-xs"
  >
    <p
      v-for="{ text } in sellingPoints"
      :key="text"
      class="flex justify-center gap-1 text-2xs text-gray-750"
    >
      <IconCheckmark class="size-4 rounded-full border border-gray-750" />
      {{ text }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const { $i18n } = useNuxtApp()

const sellingPoints = computed(() => [
  { icon: 'IconInvoice', text: $i18n.t('promises.pay_with_invoice') },
  { icon: 'IconDelivery', text: $i18n.t('promises.free_return_and_shipping') },
  { icon: 'IconReturn', text: $i18n.t('promises.return_policy') },
])
</script>
