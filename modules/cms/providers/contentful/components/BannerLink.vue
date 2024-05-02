<template>
  <div
    v-if="blok?.fields.ctaUrl"
    class="border border-white px-7 py-3.5 text-sm leading-normal text-white"
  >
    <SFLink
      :key="blok?.fields.uid"
      raw
      :to="blok?.fields.ctaUrl"
      @click="clickObserver(blok)"
    >
      {{ blok.fields.label }}
    </SFLink>
  </div>
</template>

<script setup lang="ts">
import type { CMSBannerLinkProps } from '~/modules/cms/providers/contentful/types'

defineProps<CMSBannerLinkProps>()

const { trackPromotion } = useTrackingEvents()

const clickObserver = (link: CMSBannerLinkProps['blok']) => {
  return (
    link?.fields.tracking?.fields.promotion_id &&
    trackPromotion('select_promotion', link.fields.tracking.fields)
  )
}
defineOptions({ name: 'CMSBannerLink' })
</script>
