<template>
  <div>
    <SFHeadline size="sm" tag="h2" is-uppercase class="mb-3">
      {{ $t('osp.deliver_address') }}
    </SFHeadline>
    <p
      v-for="(formattedAddress, index) in getFormattedLocaleAddresses(address)"
      :key="index"
    >
      {{ formattedAddress }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ address: OrderAddress }>()
</script>
