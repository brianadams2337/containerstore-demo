<template>
  <div
    v-if="blok"
    v-editable="blok"
    class="relative overflow-hidden bg-[#a6a6a6]"
  >
    <NuxtImg
      v-if="imageSource && imageSource.src"
      class="size-full object-cover"
      provider="storyblok"
      :sizes="sizes"
      :src="imageSource.src"
      :alt="imageSource.alt"
      loading="lazy"
    />

    <div
      class="absolute top-0 flex size-full overflow-hidden p-5 text-white md:p-[60px]"
    >
      <div
        class="flex h-full flex-col overflow-hidden"
        :class="[...align, ...justify]"
      >
        <div
          v-if="blok.topline"
          class="text-xs font-semibold leading-loose md:text-base"
        >
          {{ blok.topline }}
        </div>
        <SFHeadline
          v-if="blok.headline"
          is-uppercase
          class="!block leading-tight md:text-[40px]"
        >
          {{ blok.headline }}
        </SFHeadline>
        <p
          v-if="blok.text"
          class="mt-3 overflow-auto text-xs scrollbar-hide md:pt-5"
        >
          {{ blok.text }}
        </p>
        <SFButton
          v-if="hasCta && blok.cta_link"
          class="mt-10 shrink-0"
          :to="blok.cta_link?.cached_url"
        >
          {{ blok.cta }}
        </SFButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions , computed } from 'vue'
import { useCMSAlignment } from '../composables/useCMSAlignment'
import type { CMSImageTextProps } from '../types'
import { useStoryblokImageSanitizer } from '../composables/useStoryblokImage'
const props = withDefaults(defineProps<CMSImageTextProps>(), {
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const { sanitize } = useStoryblokImageSanitizer()

const imageSource = computed(() => {
  if (!props.blok?.image.length) {
    return
  }

  return sanitize(props.blok?.image?.[0])
})

const { align, justify } = useCMSAlignment(props.blok)

const hasCta = computed(() => props.blok?.cta && props.blok?.cta_link)

defineOptions({ name: 'CMSImageText' })
</script>
<style lang="css" scoped>
.gradient {
  background-image: linear-gradient(
      to bottom,
      rgb(0 0 0 / 0.14),
      rgb(0 0 0 / 0.14)
    ),
    linear-gradient(to bottom, rgb(0 0 0 / 0.11), rgb(0 0 0 / 0));
}
</style>
