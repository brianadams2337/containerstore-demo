<template>
  <div>
    <Headline size="sm" tag="h2" is-uppercase class="mb-3">
      {{ $t('osp.deliver_address') }}
    </Headline>
    <p>
      {{ address?.shipping.recipient.firstName }} -
      {{ address?.shipping.recipient.lastName }}
    </p>
    <p>
      {{ address?.shipping.street }}
      {{ address?.shipping.houseNumber }}
    </p>
    <p>
      {{ address?.shipping.zipCode }}
      {{ address?.shipping.city }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  address: {
    type: Object as PropType<Order['address']>,
    required: true,
  },
})
</script>
