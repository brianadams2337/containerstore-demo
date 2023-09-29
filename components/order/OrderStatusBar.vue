<template>
  <div class="flex flex-col justify-between md:flex-row">
    <div class="flex flex-row-reverse items-center md:flex-row">
      <IconDelivery class="mr-0 h-6 w-14 md:mr-4" />
      <div class="grow">
        <Headline
          tag="h2"
          size="sm"
          type="loud"
          is-bold
          :is-uppercase="false"
          class="mb-1">
          {{ $t('my_account.orders.delivery') }} {{ index + 1 }}
        </Headline>
        <Headline tag="h3" size="xs" :is-uppercase="false" class="!font-normal">
          {{ $t('my_account.orders.expected_delivery_from') }}:
          <span class="font-semibold">
            {{
              ` ${localeFormattedDate(deliveryDate.minimum)}
              - ${localeFormattedDate(deliveryDate.maximum)}`
            }}
          </span>
        </Headline>
      </div>
    </div>
    <div v-show="isLessThan('md')" class="mt-5">
      <ProgressBar
        :progress="progressLevel"
        class="mb-1 mt-2"
        rounded
        :type="progressType" />
      <h3 class="mt-1 text-xs">
        Status:
        <span class="font-bold capitalize">{{ formattedStatus }}</span>
      </h3>
    </div>
    <div class="mt-5 text-center md:mt-2">
      <!-- TODO: On hold needs clarification from checkout, then can bind to properties correctly -->
      <DefaultLink
        target="_blank"
        class="w-full justify-center rounded bg-primary px-5 py-3 text-xs font-semibold text-white md:w-auto md:px-8"
        to="">
        {{ $t('my_account.orders.shipment_detail') }}
      </DefaultLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DeliveryInfo } from './OrderItems.vue'
import { Status, DeliveryProgress } from '~/constants/order'

const props = defineProps({
  index: {
    type: Number as PropType<number>,
    required: true,
  }, // zero based index
  carrierKey: {
    type: String as PropType<DeliveryInfo['carrierKey']>,
    required: true,
  },
  formattedStatus: {
    type: String as PropType<DeliveryInfo['formattedStatus']>,
    required: true,
  },
  deliveryStatus: {
    type: String as PropType<DeliveryInfo['deliveryStatus']>,
    required: true,
  },
  deliveryDate: {
    type: Object as PropType<DeliveryInfo['deliveryDate']>,
    required: true,
  },
})

const { isLessThan } = useViewport()

const progressLevel = computed<number>(() => {
  return DeliveryProgress[props.deliveryStatus] || 5
})

const progressType = computed<'success' | 'warn' | 'danger'>(() => {
  return props.deliveryStatus !== Status.CANCELLATION_COMPLETED
    ? 'success'
    : 'danger'
})
</script>
