<template>
  <component
    :is="baseTag"
    v-if="isActive && shouldBeVisible"
    v-bind="bindings"
    id="banner"
    v-editable="blok"
    class="sticky text-sm">
    <slot :close="close">
      <transition
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
        leave-active-class="transform transition ease-out duration-300 ">
        <div
          v-if="isOpen"
          ref="element"
          class="relative z-50 flex w-full items-center"
          :class="{
            'bg-tertiary-1-500 text-black': is('info'),
            'bg-tertiary-2-500 text-white': is('sale'),
            'bg-tertiary-3-500 text-black': is('highlight'),
            'bg-black text-white': is('alert'),
          }">
          <section
            class="container flex flex-col items-center justify-center gap-2 text-center sm:relative sm:flex-row"
            :class="{ 'sm:flex-col': hasScrollableLinks }">
            <slot name="body">
              <div class="md:flex md:w-full md:items-center md:justify-center">
                <CmsText
                  :blok="{
                    body: blok.body,
                    _uid: blok._uid,
                    component: 'CmsText',
                  }" />
                <Countdown
                  v-if="blok.countdown_until"
                  :until="blok.countdown_until"
                  class="my-4 md:ml-5"
                  @finished="close" />
                <ScrollableLinkList
                  v-if="hasScrollableLinks"
                  class="ml-5"
                  :links="blok.links ?? []" />
              </div>
            </slot>

            <slot name="action" :close="close">
              <AppButton
                no-padding
                size="xs"
                type="ghost"
                class="absolute right-6"
                @click="close">
                <template #icon="{ _class }">
                  <IconClose :class="_class" />
                </template>
              </AppButton>
            </slot>
          </section>
        </div>
      </transition>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { SbBanner } from '~/storyblok/types/storyblok'
import useBanner from '~/composables/useBanner'

const props = defineProps({
  blok: {
    type: Object as PropType<SbBanner>,
    required: true,
  },
  type: {
    type: String,
    default: '',
    validator: (value: string) =>
      ['info', 'sale', 'dark', 'alert', ''].includes(value),
  },
  publishedAt: {
    type: String,
    required: true,
  },
})

const { close, isOpen, shouldBeVisible: _shouldBeVisible } = useBanner()
// const { trackPromotion } = useTrackingEvents()
const isActive = computed(() =>
  isEmpty(props.blok) ? true : props.blok.is_active,
)

const shouldBeVisible = computed(() => _shouldBeVisible(props.publishedAt))

const is = (value: string | string[]) =>
  (props.type && value.includes(props.type)) ||
  (props.blok.type && value.includes(props.blok.type))
const hasScrollableLinks = computed(() => !isEmpty(props.blok?.links))
const cachedUrl = computed(() => props.blok.cta_url?.cached_url)
const baseTag = computed(() => (cachedUrl.value ? 'StoryblokLink' : 'div'))
const bindings = computed(() =>
  cachedUrl.value ? { to: cachedUrl.value } : {},
)
const element = ref(null)

const { stop } = useIntersectionObserver(
  element,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.blok.promotion_id) {
      // trackPromotion('view_promotion', props.blok)
      stop()
    }
  },
  {
    threshold: 0.5,
  },
)
</script>

<script lang="ts">
export default {
  name: 'CmsBanner',
}
</script>
