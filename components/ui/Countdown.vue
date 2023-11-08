<template>
  <div class="flex pl-1.5 text-xs">
    <div
      v-for="(value, key) in countdown"
      :key="key"
      class="flex text-center font-semibold"
    >
      <span v-if="value !== undefined" class="w-4">
        {{ formatValue(value) }}
      </span>
      <span class="mx-1">
        <template v-if="showUnits">{{ $t(`global.${key}`) }}</template>
        <template v-else-if="key !== useLast(Object.keys(countdown))">
          :
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds'

const props = defineProps({
  until: {
    type: String,
    required: true,
  },
  showUnits: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['finished'])

const intervalId = ref<NodeJS.Timeout>()

const until = computed(() => Date.parse(props.until))
const countdown = ref<{ [k in CountdownUnit]?: number }>({})

const update = () => {
  const remaining = until.value - Date.now()
  const prep = (n: number) => Math.max(Math.floor(n), 0)

  countdown.value = {
    days: prep(remaining / (1000 * 60 * 60 * 24)),
    hours: prep((remaining / (1000 * 60 * 60)) % 24),
    minutes: prep((remaining / 1000 / 60) % 60),
    seconds: prep((remaining / 1000) % 60),
  }

  if (remaining <= 0) {
    clearInterval(intervalId.value)
    emit('finished')
  }
}

const formatValue = (value: number) => {
  return value <= 9 && value >= 0 ? `0${value}` : value
}

onMounted(() => {
  update()
  intervalId.value = setInterval(update, 1000)
})

onUnmounted(() => clearInterval(intervalId.value))

defineOptions({ name: 'AppCountdown' })
</script>
