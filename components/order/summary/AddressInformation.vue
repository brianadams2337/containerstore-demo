<template>
  <div>
    <p v-if="!!fullName">{{ fullName }}</p>
    <p v-if="!!streetAndHouseNumber">{{ streetAndHouseNumber }}</p>
    <p>{{ zipCode }} {{ city }}</p>
    <p v-if="additional">{{ additional }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  recipient: {
    type: Object as PropType<OrderAddress['recipient']>,
    required: true,
  },
  street: {
    type: String,
    default: undefined,
  },
  houseNumber: {
    type: String,
    default: undefined,
  },
  zipCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  additional: {
    type: String,
    default: undefined,
  },
})

const fullName = computed(() => {
  const { firstName, lastName } = props.recipient
  return [firstName, lastName].filter(Boolean).join(' ')
})

const streetAndHouseNumber = computed(() => {
  return [props.street, props.houseNumber].filter(Boolean).join(' ')
})
</script>
