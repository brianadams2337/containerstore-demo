<template>
  <div class="flex gap-2 text-sm">
    <div v-for="(value, key) in countdown" :key="key" class="flex gap-1">
      <span :class="value && value > 9 ? 'w-4' : 'w-2'">{{ value }}</span>
      {{ $tc(`global.${key}`) }}
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
})

const emit = defineEmits(['finished'])

let intervalId: any
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
    clearInterval(intervalId)
    emit('finished')
  }
}

onMounted(() => {
  update()
  intervalId = setInterval(update, 1000)
})

onUnmounted(() => clearInterval(intervalId))
</script>

<script lang="ts">
export default {
  name: 'AppCountdown',
}
</script>
