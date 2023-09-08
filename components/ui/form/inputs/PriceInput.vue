<template>
  <input
    ref="root"
    :type="inputType"
    class="h-10 w-[100px] rounded border bg-secondary-450 text-center text-sm font-semibold text-primary"
    :value="
      inputType === 'text'
        ? formatCurrency(modelValue)
        : modelValue / 10 ** decimalPlaces
    "
    @focus="focus"
    @blur="blur"
    @change="inputChange($event)" />
</template>
<script lang="ts">
export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      default: null,
    },
    min: {
      type: Number,
      default: null,
    },
    currencyCode: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions>,
      default: null,
    },
  },
  emits: ['update:model-value', 'focus', 'blur'],
  setup(props, { emit }) {
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

    return {
      focus,
      blur,
      inputChange,
      inputType,
      decimalPlaces,
      root,
      formatCurrency,
    }
  },
})
</script>
