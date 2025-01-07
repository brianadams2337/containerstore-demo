<template>
  <input
    ref="root"
    :type="inputType"
    class="h-10 w-[100px] rounded border bg-secondary-450 text-center text-sm font-semibold text-primary"
    data-testid="price-input"
    :value="
      inputType === 'text'
        ? formatCurrency(modelValue)
        : modelValue / 10 ** decimalPlaces
    "
    @focus="focus"
    @blur="blur"
    @change="inputChange($event)"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Props = {
  modelValue: number
  currencyCode: string
  locale: string
  max: number
  min: number
  formatOptions?: Intl.NumberFormatOptions | null
}
const props = withDefaults(defineProps<Props>(), {
  formatOptions: null,
})

const emit = defineEmits<{
  'update:model-value': [number]
  focus: [FocusEvent]
  blur: [FocusEvent]
}>()

const isActive = ref(false)
const root = ref<HTMLInputElement>()

const focus = (e: FocusEvent) => {
  isActive.value = true

  setTimeout(() => {
    const el = root.value
    if (el instanceof HTMLInputElement) {
      el.select()
    }
  }, 0)

  emit('focus', e)
}

const inputType = computed(() => (isActive.value ? 'number' : 'text'))

const blur = (e: FocusEvent) => {
  isActive.value = false
  emit('blur', e)
}

const decimalPlaces = computed(() => {
  if (!props.currencyCode) {
    return 2
  }

  const parts = new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currencyCode,
  }).formatToParts(0)

  const fraction = parts.find((p) => p.type === 'fraction')

  if (!fraction) {
    return 0
  }

  return fraction.value.length
})

const inputChange = (event: Event) => {
  const { value } = event.target as HTMLInputElement
  if (value === props.modelValue.toString()) {
    return
  }

  const val = parseFloat(value)
  let adjustedValue: number

  adjustedValue = Math.round(val) * 10 ** decimalPlaces.value
  adjustedValue = Math.min(Math.max(props.min, adjustedValue), props.max)

  if (!isNaN(adjustedValue)) {
    emit('update:model-value', adjustedValue)
  }
}

const formatCurrency = (value: number): string => {
  return (value / 10 ** decimalPlaces.value).toLocaleString(props.locale, {
    style: 'currency',
    currency: props.currencyCode,
    ...props.formatOptions,
  })
}
</script>
