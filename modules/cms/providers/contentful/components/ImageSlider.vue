<template>
  <div class="sm:mx-14" :class="marginClasses">
    <div class="flex w-full justify-between px-6 sm:px-0">
      <Headline v-if="blok?.fields.headline" tag="p" size="base" is-uppercase>
        {{ blok.fields.headline }}
      </Headline>

      <DefaultLink
        v-if="blok?.fields.ctaUrl && blok.fields.ctaLabel"
        :to="blok.fields.ctaUrl"
      >
        {{ blok.fields.ctaUrl }}
      </DefaultLink>
    </div>
    <HorizontalItemsSlider
      with-arrows
      class="mt-4 box-border flex overflow-x-auto overflow-y-hidden scrollbar-hide"
    >
      <component
        :is="getComponentName(entry?.sys?.contentType?.sys?.id) ?? 'div'"
        v-for="entry in blok?.fields.slides"
        ref="slideElements"
        :key="entry?.sys?.contentType?.sys?.id"
        class="box-content shrink-0 snap-start snap-always px-0.5 first:pl-5 last:pr-5 sm:box-border sm:first:pl-0 sm:last:pr-0"
        :blok="entry"
      />
    </HorizontalItemsSlider>
  </div>
</template>

<script setup lang="ts">
import { getComponentName } from '~/modules/cms/utils/helpers'
import type { CMSImageSliderProps } from '~/modules/cms/providers/contentful/types'
import { useContentfulMargins } from '~/modules/cms/providers/contentful/composables/useContentfulMargins'

const props = defineProps<CMSImageSliderProps>()
const { marginClasses } = useContentfulMargins(props.blok?.fields.margin)
</script>
