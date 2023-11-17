<template>
  <div v-if="hasInfos">
    <div>
      <p v-for="(group, idx) in materialInfo" :key="idx">
        {{ group.materialGroupName }}:
        {{ group.values }}
      </p>
    </div>
    <div class="mt-2 flex flex-wrap gap-1">
      <ProductCareSymbol
        v-for="symbol in careInfo"
        :key="symbol.id"
        :symbol="symbol"
      />
    </div>
  </div>
  <div v-else>
    <p class="whitespace-pre-line">No information provided.</p>
  </div>
</template>

<script setup lang="ts">
type CareInfo = {
  id?: number
  label: string
  value?: string
}

type MaterialInfo = {
  materialGroupName: string
  values: string
}

const props = defineProps({
  materialInfo: {
    type: Array as PropType<MaterialInfo[]>,
    default: () => [],
  },
  careInfo: {
    type: Array as PropType<CareInfo[]>,
    default: () => [],
  },
})

const hasInfos = computed(() => {
  return props.materialInfo.length || props.careInfo.length
})
</script>
