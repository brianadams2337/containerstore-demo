<template>
  <div class="bg-white pb-4">
    <SFHeadline class="mb-4 break-all" tag="h2" size="xl">
      {{ headline }}
    </SFHeadline>
    <p class="break-all font-semibold text-secondary">
      <span>{{ shopId }} - {{ orderId }}</span>
      <span>{{ ' · ' }}</span>
      <span>
        {{ $t('my_account.orders.item_count', { count: itemCount }) }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormatDate } from '~/composables/useFormatDate'
import { useI18n } from '#i18n'
import { SFHeadline } from '#storefront-ui/components'

type Props = {
  orderId: number
  shopId: number
  itemCount: number
  orderDate: string
}
const props = defineProps<Props>()

const i18n = useI18n()

const { formatLocaleDate } = useFormatDate()

const headline = computed(() => {
  const date = formatLocaleDate(props.orderDate)
  return i18n.t('my_account.orders.order_summary_header', { date })
})
</script>
