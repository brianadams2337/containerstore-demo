<template>
  <div class="flex flex-col justify-between md:flex-row">
    <div class="flex flex-row-reverse items-center md:flex-row">
      <IconDelivery class="mr-0 h-6 w-14 md:mr-4" />
      <div class="mr-2 flex grow flex-col">
        <SFHeadline tag="h2" size="sm" is-bold class="mb-1">
          {{ $t('my_account.orders.delivery') }} {{ index + 1 }}
        </SFHeadline>
        <SFHeadline tag="h3" size="xs" class="flex flex-wrap !font-normal">
          <span>{{ $t('my_account.orders.expected_delivery_from') }}:</span>
          <span class="font-semibold">
            {{
              ` ${formatLocaleDate(deliveryDate.minimum)}
              - ${formatLocaleDate(deliveryDate.maximum)}`
            }}
          </span>
        </SFHeadline>
      </div>
    </div>
    <div class="mt-5 md:hidden">
      <SFProgressBar
        :progress="progressLevel"
        class="mb-1 mt-2"
        rounded
        :type="progressType"
      />
      <h3 class="mt-1 text-xs">
        Status:
        <span class="font-bold capitalize">{{ formattedStatus }}</span>
      </h3>
    </div>
    <div class="mt-5 text-center md:mt-2">
      <!-- NOTE: This space can be used to insert a custom shipment detail link using the Link component -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DeliveryProgress, OrderStatus } from '~/constants/order'
import { useFormatDate } from '~/composables/useFormatDate'
import { SFHeadline, SFProgressBar } from '#storefront-ui/components'

type Props = {
  index: number
  carrierKey: DeliveryInfo['carrierKey']
  formattedStatus: DeliveryInfo['formattedStatus']
  deliveryStatus: DeliveryInfo['deliveryStatus']
  deliveryDate: DeliveryInfo['deliveryDate']
}
const props = defineProps<Props>()

const { formatLocaleDate } = useFormatDate()

const progressLevel = computed<number>(() => {
  return DeliveryProgress[props.deliveryStatus] || DeliveryProgress.DEFAULT
})

const progressType = computed<'success' | 'warn' | 'danger'>(() => {
  return props.deliveryStatus !== OrderStatus.CANCELLATION_COMPLETED
    ? 'success'
    : 'danger'
})
</script>
