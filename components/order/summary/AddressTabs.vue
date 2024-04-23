<template>
  <div>
    <nav
      role="tablist"
      :class="tabsClass"
      class="flex flex-wrap justify-center border-b border-b-secondary-450 px-5 text-center text-sm font-semibold"
    >
      <div
        v-for="({ name, label }, idx) in items"
        :key="`tab-${name}-${idx}`"
        class="mx-auto"
      >
        <AppButton
          :id="`tab-${name}-${idx}`"
          :aria-controls="`content-${name}`"
          role="tab"
          type="ghost"
          class="!p-3.5"
          :class="activeTab === idx ? 'text-primary' : 'text-secondary'"
          @click="toggleTab(idx)"
        >
          {{ label }}
        </AppButton>
        <div v-if="activeTab === idx" class="mx-auto h-0.5 w-8 bg-primary" />
      </div>
    </nav>
    <section id="content" aria-live="polite" role="region" class="mt-6 text-sm">
      <article
        v-for="({ name }, idx) in items"
        :id="`content-${name}`"
        :key="`content-${name}`"
        role="tabpanel"
        tabindex="-1"
      >
        <slot v-if="activeTab === idx" :name="name" />
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SummaryItem } from './AddressSummary.vue'

defineProps({
  items: {
    type: Array as PropType<SummaryItem[]>,
    required: true,
  },
  tabsClass: {
    type: String,
    default: '',
  },
})

const activeTab = ref(0)

const toggleTab = (idx: number) => {
  activeTab.value = idx
}
</script>
