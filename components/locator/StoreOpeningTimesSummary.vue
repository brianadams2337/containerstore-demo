<template>
  <details class="mt-5 rounded bg-secondary-450 px-2" :open="openingHoursOpen">
    <summary>
      <SFButton
        type="raw"
        class="flex-row-reverse text-xs !normal-case"
        rounded
        @click="openingHoursOpen = !openingHoursOpen"
      >
        {{ $t('store_locator.buttons.opening_hours') }}
      </SFButton>
    </summary>
    <div class="pb-2">
      <div v-for="day in daysOfWeek" :key="day" class="mb-1">
        <div class="flex items-center justify-between">
          <div class="grow">
            <!-- TODO: add bold for current day -->
            {{ $t(`store_locator.opening_times.${day}`) }}
          </div>
          <div class="flex w-24 flex-col text-justify">
            <div v-if="!openingTimes[day].length">
              {{ $t('store_locator.labels.store_closed') }}
            </div>
            <div v-else>
              <div v-for="(time, idx) in openingTimes[day]" :key="idx">
                {{ time.timeFrom }} - {{ time.timeUntil }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { OpeningTimes } from '@scayle/omnichannel-nuxt'
import { useFirstDayOfWeek } from '~/composables/useFirstDayOfWeek'

interface Props {
  openingTimes: OpeningTimes
}

defineProps<Props>()

const openingHoursOpen = ref(false)

const firstDay = useFirstDayOfWeek()

type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const daysOfWeek = computed<DayOfWeek[]>(() => {
  const result = DAYS.slice()
  const begin = result.slice(firstDay - 1)
  result.splice(firstDay - 1)
  result.unshift(...begin)
  return result
})
</script>
