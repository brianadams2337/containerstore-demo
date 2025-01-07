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
import { computed } from 'vue'
import { useI18n } from '#i18n'
import { useCurrentShop } from '#storefront/composables'

const { t } = useI18n()
const currentShop = useCurrentShop()

const sellingPoints = computed(() => [
  { icon: 'IconInvoice', text: t('promises.flexible_payment') },
  {
    icon: 'IconDelivery',
    text: t('promises.free_shipping', { currency: currentShop.value.currency }),
  },
  { icon: 'IconReturn', text: t('promises.return_policy') },
])
</script>
