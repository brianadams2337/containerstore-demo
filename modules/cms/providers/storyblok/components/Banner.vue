<template>
  <component
    :is="baseTag"
    v-if="isActive && shouldBeVisible"
    v-bind="bindings"
    id="banner"
    v-editable="blok"
    class="sticky text-sm"
  >
    <slot :close="storefrontBanner && storefrontBanner.close">
      <Transition
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
        leave-active-class="transform transition ease-out duration-300 "
      >
        <Intersect
          v-if="storefrontBanner && storefrontBanner.isOpen"
          :threshold="0.5"
          class="relative z-50 flex w-full items-center"
          :class="classes"
          @enter="onIntersect"
        >
          <section
            class="container flex flex-col items-center justify-center gap-2 text-center sm:relative sm:flex-row"
            :class="{ 'sm:flex-col': hasScrollableLinks }"
          >
            <slot name="body">
              <div class="md:flex md:w-full md:items-center md:justify-center">
                <CMSText
                  :blok="{
                    body: blok.body,
                    _uid: blok._uid,
                    component: 'CmsText',
                  }"
                />
                <SFCountdown
                  v-if="blok.countdown_until"
                  :time-until="blok.countdown_until"
                  class="my-4 md:ml-5"
                  @finished="storefrontBanner && storefrontBanner.close"
                />
                <CMSScrollableLinkList
                  v-if="hasScrollableLinks"
                  class="ml-5"
                  :links="[...blok.links]"
                />
              </div>
            </slot>

            <slot
              name="action"
              :close="storefrontBanner && storefrontBanner.close"
            >
              <SFButton
                no-padding
                size="xs"
                type="ghost"
                class="absolute right-6"
                @click="storefrontBanner && storefrontBanner.close"
              >
                <template #icon="{ _class }">
                  <IconClose :class="_class" />
                </template>
              </SFButton>
            </slot>
          </section>
        </Intersect>
      </Transition>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed, defineOptions, resolveComponent } from 'vue'
import { isEmpty } from 'radash'
import { useStorefrontTracking } from '../composables/storefront/useStorefrontTracking'
import { useStorefrontBanner } from '../composables/storefront/useStorefrontBanner'
import type { CMSBannerProps } from '../types'
import CMSText from '~/modules/cms/providers/storyblok/components/Text.vue'

const props = withDefaults(defineProps<CMSBannerProps>(), {
  type: '',
})

const storefrontBanner = useStorefrontBanner()
const storefrontTracking = useStorefrontTracking()
const isActive = computed(() => {
  return isEmpty(props.blok) ? true : props.blok.is_active
})

const shouldBeVisible = computed(
  () => storefrontBanner && storefrontBanner.shouldBeVisible(props.publishedAt),
)

const is = (value: string | string[]) => {
  return (
    (props.type && value.includes(props.type)) ||
    (props.blok.type && value.includes(props.blok.type))
  )
}

const hasScrollableLinks = computed(() => !isEmpty(props.blok?.links))
const cachedUrl = computed(() => props.blok.cta_url?.cached_url)
const baseTag = computed(() => {
  return cachedUrl.value ? resolveComponent('CMSStoryblokLink') : 'div'
})
const bindings = computed(() => {
  return cachedUrl.value ? { to: cachedUrl.value } : {}
})

const classes = computed(() => ({
  'bg-tertiary-1-500 text-black': is('info'),
  'bg-tertiary-2-500 text-white': is('sale'),
  'bg-tertiary-3-500 text-black': is('highlight'),
  'bg-black text-white': is('alert'),
}))

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok.promotion_id) {
    return
  }
  storefrontTracking &&
    storefrontTracking.trackPromotion('view_promotion', props.blok)
  stop()
}

defineOptions({ name: 'CMSBanner' })
</script>
