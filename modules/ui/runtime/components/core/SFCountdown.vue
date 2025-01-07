<template>
  <div class="flex px-1.5 text-xs">
    <div
      v-for="(value, key) in countdown"
      :key="key"
      class="flex text-center font-semibold"
    >
      <div v-if="shouldShowValue(key, value)" class="inline-flex">
        <span v-if="value !== undefined" class="tabular-nums">
          {{ value }}
        </span>
        <span v-if="showUnits">
          <span>{{ renderUnit($t(`global.${key}`)) }}</span>
        </span>
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import { DAY, HOURS, MINUTE, SECOND } from '~/constants/time'

type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds'

type Props = {
  timeUntil: string
  showUnits?: boolean
  unitSize?: 'short' | 'long'
}

const props = withDefaults(defineProps<Props>(), {
  showUnits: false,
  unitSize: 'long',
})

const emit = defineEmits<{ finished: [] }>()

const timeUntil = computed(() => Date.parse(props.timeUntil))
const countdown = ref<{ [k in CountdownUnit]?: number }>({})

const renderUnit = (unit: string) => {
  return props.unitSize === 'short' ? unit.substring(0, 1).toUpperCase() : unit
}

const shouldShowValue = (key: CountdownUnit, value?: number) => {
  if (value === 0 && key === 'days') {
    return false
  }
  return !(key === 'seconds' && countdown.value.days !== 0)
}

const start = () => {
  const remaining = timeUntil.value - Date.now()

  countdown.value = {
    days: Math.floor(remaining / (SECOND * MINUTE * HOURS * DAY)),
    hours: Math.floor((remaining / (SECOND * MINUTE * HOURS)) % DAY),
    minutes: Math.floor((remaining / SECOND / MINUTE) % HOURS),
    seconds: Math.floor((remaining / SECOND) % MINUTE),
  }

  if (remaining <= 0) {
    emit('finished')
  }
}

useIntervalFn(start, SECOND, { immediateCallback: true })
</script>
