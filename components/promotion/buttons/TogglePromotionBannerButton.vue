<template>
  <SFButton
    data-test-id="toggle-promotion-banner-button"
    type="raw"
    size="xs"
    class="min-h-[1.875rem] !w-fit items-center !px-2 !py-1 text-xs font-semibold leading-5 text-white"
    :aria-expanded="modelValue.toString()"
    :style="backgroundColorStyle"
    :class="{ [borderClass]: modelValue }"
    @click="toggle"
  >
    <IconGift class="size-3" />
    <span v-if="modelValue">{{ $t('promotion.hide_my_promotions') }}</span>
    <span v-else> {{ $t('promotion.see_my_promotions') }}</span>
    <template #append-icon="{ _class }">
      <component
        :is="isMobileView ? 'IconChevronDown' : 'IconChevronUp'"
        v-if="modelValue"
        :class="_class"
      />
      <component
        :is="isMobileView ? 'IconChevronUp' : 'IconChevronDown'"
        v-else
        :class="_class"
      />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
type Props = {
  modelValue: boolean
  isMobileView?: boolean
}

const props = withDefaults(defineProps<Props>(), { isMobileView: false })

const { backgroundColorStyle } = useCurrentPromotion()

const emit = defineEmits(['update:modelValue'])

const borderClass = computed(() =>
  props.isMobileView ? '!border-b-[0.5px]' : '!border-t-[0.5px]',
)

const toggle = () => emit('update:modelValue', !props.modelValue)
</script>
