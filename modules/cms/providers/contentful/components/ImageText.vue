<template>
  <div v-if="blok" class="relative overflow-hidden bg-[#a6a6a6]">
    <NuxtImg
      v-if="imageSource && imageSource.src"
      class="size-full object-cover"
      provider="contentful"
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
          v-if="blok.fields.topline"
          class="text-xs font-semibold leading-loose md:text-base"
        >
          {{ blok.fields.topline }}
        </div>
        <SFHeadline
          v-if="blok.fields.headline"
          is-uppercase
          class="!block leading-tight md:text-[40px]"
        >
          {{ blok.fields.headline }}
        </SFHeadline>
        <p v-if="blok.fields.text" class="mt-3 overflow-auto text-xs md:pt-5">
          {{ blok.fields.text }}
        </p>
        <SFButton v-if="resolvedLink" class="mt-10 shrink-0" :to="resolvedLink">
          {{ blok.fields.cta }}
        </SFButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useCMSAlignment } from '../composables/useCMSAlignment'
import type { CMSImageText } from '../types'
import { useContentfulImageSanitizer } from '../composables/useContentfulImage'
import { normalizeHomeLink } from '../../../utils/helpers'
import { NuxtImg } from '#components'
import { SFHeadline, SFButton } from '#storefront-ui/components'

const props = withDefaults(defineProps<CMSImageText>(), {
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const { sanitize } = useContentfulImageSanitizer()

const imageSource = computed(() => {
  if (!props.blok?.fields.image.length) {
    return
  }

  return sanitize(props.blok?.fields.image.at(0))
})

const { align, justify } = useCMSAlignment({
  align: props.blok?.fields.align,
  justify: props.blok?.fields.justify,
})

const hasCta = computed(
  () => props.blok?.fields.cta && props.blok?.fields.ctaLink,
)

const resolvedLink = computed(() => {
  return hasCta.value && normalizeHomeLink(props.blok?.fields.ctaLink)
})

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
