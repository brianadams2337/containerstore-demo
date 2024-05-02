<template>
  <div v-if="blok">
    <template v-if="blok?.fields.image">
      <component
        :is="getSlideComponent(image)"
        v-for="image in blok?.fields.image"
        :key="image?.sys.id"
        :preload="props.preload"
        :blok="image"
      />
    </template>
  </div>
  <div class="pointer-events-none absolute top-0 flex size-full p-5">
    <div class="flex h-full flex-col" :class="[...justify, ...align]">
      <h3
        v-if="blok?.fields.topline"
        class="text-[.875rem] font-bold md:text-[1rem]"
        :class="blok?.fields.isDark ? 'text-primary' : 'text-white'"
      >
        {{ blok?.fields.topline }}
      </h3>

      <h2
        v-if="blok?.fields.headline"
        class="text-[2rem] font-bold md:text-[2.5rem]"
        :class="blok?.fields.isDark ? 'text-primary' : 'text-white'"
      >
        {{ blok?.fields.headline }}
      </h2>

      <SFLink
        v-if="blok?.fields.ctaUrl && blok?.fields.ctaLabel"
        :to="blok?.fields.ctaUrl"
        class="mt-10"
      >
        <button
          v-if="blok?.fields.ctaLabel"
          class="pointer-events-auto rounded px-6 py-3.5 text-sm font-bold"
          :class="
            blok?.fields.isDark
              ? 'bg-primary text-white'
              : 'bg-white text-primary'
          "
        >
          {{ blok?.fields.ctaLabel }}
        </button>
      </SFLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Entry } from 'contentful'
import {
  isTypeImage,
  isTypeVideo,
} from '~/modules/cms/providers/contentful/types/gen/index'

import type {
  CMSSlideProps,
  TypeImageSkeleton,
  TypeVideoSkeleton,
} from '~/modules/cms/providers/contentful/types'

const props = withDefaults(defineProps<CMSSlideProps>(), {
  preload: false,
})

const { justify, align } = useCMSAlignment({
  align: props.blok?.fields.align,
  justify: props.blok?.fields.justify,
})

function getSlideComponent(
  file:
    | Entry<
        TypeImageSkeleton | TypeVideoSkeleton,
        'WITHOUT_UNRESOLVABLE_LINKS',
        string
      >
    | undefined,
) {
  if (!file) {
    return 'div'
  }
  if (isTypeImage(file)) {
    return 'CMSImage'
  }
  if (isTypeVideo(file)) {
    return 'CMSVideo'
  }
}
defineOptions({ name: 'CMSSlide' })
</script>
