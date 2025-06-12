<template>
  <div class="flex flex-col gap-2">
    <div class="text-sm font-semibold text-primary">
      {{ $t('subscription.subscription') }}
    </div>
    <ul class="flex flex-col gap-1 text-sm text-secondary">
      <li class="flex gap-1">
        <span class="font-medium"> {{ $t('subscription.interval') }}: </span>
        <span>
          {{ getSubscriptionInterval() }}
        </span>
      </li>
      <li class="flex gap-1">
        <span class="font-medium">
          {{ $t('subscription.follow_up_delivery') }}:
        </span>
        <span>
          {{ getSubscriptionDeliveryDate() }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#i18n'

const { subscription } = defineProps<{ subscription: Record<string, string> }>()

const { t } = useI18n()
const getSubscriptionInterval = () => {
  switch (subscription.subscriptionInterval) {
    case '1_months_1':
      return t('order_detail_product_subscription.interval_keys.1_months_1')
    case '2_months':
      return t('order_detail_product_subscription.interval_keys.2_months')
    case '3_months':
      return t('order_detail_product_subscription.interval_keys.3_months')
  }
}
const getSubscriptionDeliveryDate = () => {
  switch (subscription.subscriptionDeliveryDate) {
    case '1':
      return t('order_detail_product_subscription.delivery_keys.1')
    case '15':
      return t('order_detail_product_subscription.delivery_keys.15')
  }
}
</script>
