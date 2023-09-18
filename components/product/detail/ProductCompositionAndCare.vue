<template>
  <div>
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
        :symbol="symbol" />
    </div>
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

defineProps({
  materialInfo: { type: Array as PropType<MaterialInfo[]>, required: true },
  careInfo: {
    type: Array as PropType<CareInfo[]>,
    required: true,
  },
})
</script>
