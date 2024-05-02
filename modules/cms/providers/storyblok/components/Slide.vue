<template>
  <div>
    <component
      :is="getSlideComponent(image)"
      v-for="image in blok.image"
      :key="image._uid"
      class="aspect-[1/1] md:aspect-[9/4]"
      :blok="image"
      :preload="preload"
    />
  </div>
  <div class="pointer-events-none absolute top-0 flex size-full p-5">
    <div class="flex h-full flex-col" :class="[...justify, ...align]">
      <h3
        v-if="blok.topline"
        class="text-[14px] font-bold md:text-[16px]"
        :class="blok.is_dark ? 'text-primary' : 'text-white'"
      >
        {{ blok.topline }}
      </h3>

      <h2
        v-if="blok.headline"
        class="text-[32px] font-bold md:text-[40px]"
        :class="blok.is_dark ? 'text-primary' : 'text-white'"
      >
        {{ blok.headline }}
      </h2>

      <SFLink
        v-if="blok.cta_url?.cached_url && blok.cta_label"
        :to="blok.cta_url.cached_url"
        class="mt-10"
      >
        <button
          v-if="blok.cta_label"
          class="pointer-events-auto rounded px-6 py-3.5 text-sm font-bold"
          :class="
            blok.is_dark ? 'bg-primary text-white' : 'bg-white text-primary'
          "
        >
          {{ blok.cta_label }}
        </button>
      </SFLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  SbCmsImage,
  SbSlide,
  SbVideo,
} from '~/modules/cms/providers/storyblok/types'

const props = defineProps({
  blok: {
    type: Object as PropType<SbSlide>,
    required: true,
  },
  preload: {
    type: Boolean,
    default: false,
  },
})

const { justify, align } = useCMSAlignment(props.blok)

const getSlideComponent = (file: SbVideo | SbCmsImage) => {
  if (!file) {
    return 'div'
  }
  if (file.component === 'Video') {
    return 'CMSVideo'
  }
  if (file.component === 'CmsImage') {
    return 'CMSImage'
  }
}
defineOptions({ name: 'CMSSlide' })
</script>
