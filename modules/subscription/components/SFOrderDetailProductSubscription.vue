<template>
  <div class="flex flex-col gap-2">
    <div class="text-sm font-semi-bold-variable text-gray-900">
      {{ $t('subscription.title') }}
    </div>
    <ul class="flex flex-col gap-1 text-sm text-gray-600">
      <li class="flex gap-1">
        <span class="font-medium">
          {{ $t('subscription.order.interval') }}:
        </span>
        <span>
          {{
            $t(
              'subscription.order.interval_keys.' +
                subscription.subscriptionInterval,
            )
          }}
        </span>
      </li>
      <li class="flex gap-1">
        <span class="font-medium">
          {{ $t('subscription.order.follow_up_delivery') }}:
        </span>
        <span>
          {{
            $t(
              'subscription.order.delivery_keys.' +
                subscription.subscriptionDeliveryDate,
            )
          }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ subscription: Record<string, string> }>()
</script>
