<template>
  <div v-if="hasInfos">
    <div v-if="description" class="whitespace-pre-line">{{ description }}</div>
    <br />
    <template v-if="baseInfos.length">
      <p v-for="(info, i) in baseInfos" :key="i">{{ info }}</p>
    </template>
    <br />
    <div>
      <p v-if="fitInfos.fitting">
        {{ $t('pdp.fitting') }}: {{ fitInfos.fitting }}
      </p>
      <p v-if="fitInfos.neckline">
        {{ $t('pdp.neckline') }}: {{ fitInfos.neckline }}
      </p>
      <p v-if="fitInfos.upperLength">
        {{ $t('pdp.upper_length') }}: {{ fitInfos.upperLength }}
      </p>
      <p v-if="fitInfos.sleeveLength">
        {{ $t('pdp.sleeve_length') }}: {{ fitInfos.sleeveLength }}
      </p>
      <p v-if="fitInfos.shirtCut">
        {{ $t('pdp.shirt_cut') }}: {{ fitInfos.shirtCut }}
      </p>
      <p v-if="fitInfos.shortsLength">
        {{ $t('pdp.shorts_length') }}: {{ fitInfos.shortsLength }}
      </p>
      <p v-if="fitInfos.trousersLength">
        {{ $t('pdp.trousers_length') }}: {{ fitInfos.trousersLength }}
      </p>
      <p v-if="fitInfos.skirtLength">
        {{ $t('pdp.shorts_length') }}: {{ fitInfos.skirtLength }}
      </p>
      <p v-if="fitInfos.trousersCut">
        {{ $t('pdp.trousers_cut') }}: {{ fitInfos.trousersCut }}
      </p>
    </div>
  </div>
  <div v-else>
    <p class="whitespace-pre-line">No information provided.</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  description: {
    type: String,
    default: '',
  },
  baseInfos: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  fitInfos: {
    type: Object as PropType<{ [key: string]: string }>,
    default: () => ({}),
  },
})

const hasInfos = computed(() => {
  return props.description || props.baseInfos.length || props.fitInfos.length
})
</script>
