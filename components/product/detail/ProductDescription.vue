<template>
  <div>
    <div class="whitespace-pre-line">{{ productDescriptionInfo }}</div>

    <br />

    <p v-for="(info, i) in productInfos" :key="i">{{ info }}</p>

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
</template>

<script setup lang="ts">
defineProps({
  productDescriptionInfo: {
    type: String,
    default: '',
  },
  productInfos: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  fitInfos: {
    type: Object as PropType<{ [key: string]: string }>,
    default: () => ({}),
  },
})
</script>
