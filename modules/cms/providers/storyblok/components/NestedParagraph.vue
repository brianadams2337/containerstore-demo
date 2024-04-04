<template>
  <div
    :id="blok.anchor_id"
    v-editable="blok"
    class="prose mb-10 flex w-full flex-col last:mb-0"
    :class="{
      'scroll-mt-8': blok.anchor_id,
      '': blok.nested_items?.length,
    }"
    :style="style"
  >
    <Headline
      :tag="blok.headline_tag ? blok.headline_tag : 'h3'"
      :size="getHeadlineSize(blok.headline_tag)"
      >{{ blok.headline }}</Headline
    >
    <div
      v-if="blok.cta?.linktype === 'email'"
      class="grid grid-cols-2 justify-items-start gap-8"
    >
      <AppButton type="tertiary" is-full-width>{{ blok.cta.email }}</AppButton>
      <div class="max-w-lg">
        <CmsText :blok="{ ...blok, component: 'CmsText' }" />
      </div>
    </div>
    <CmsText v-else :blok="{ ...blok, component: 'CmsText' }" />
    <template v-if="blok.nested_items">
      <component
        :is="nestedItem.component"
        v-for="nestedItem in blok.nested_items"
        :key="nestedItem._uid"
        :blok="nestedItem"
      ></component>
    </template>
    <div class="flex flex-row space-x-8">
      <div
        v-for="paragraphImage in blok.images"
        :key="`store-${paragraphImage.id}`"
        class="flex flex-row space-x-8"
      >
        <StoryblokLink
          v-if="paragraphImage.name"
          :to="paragraphImage.name"
          target="_blank"
        >
          <NuxtPicture
            class="cms-picture picture-contain"
            height="25px"
            provider="storyblok"
            :src="paragraphImage.filename"
            :alt="paragraphImage.alt"
          />
        </StoryblokLink>
        <NuxtPicture
          v-else
          class="cms-picture picture-contain"
          height="25px"
          provider="storyblok"
          :src="paragraphImage.filename"
          :alt="paragraphImage.alt"
        />
      </div>
    </div>
    <div class="max-w-lg text-sm text-gray-700">
      {{ blok.sub_title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SbNestedParagraph } from '../types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbNestedParagraph>,
    required: true,
  },
})

const style = computed(() =>
  props.blok?.background_color
    ? { backgroundColor: props.blok?.background_color }
    : undefined,
)

function getHeadlineSize(size: string | undefined) {
  if (!size) {
    return 'sm'
  }
  switch (size) {
    case 'h2':
      return 'xl'
    case 'h3':
      return 'lg'
    case 'h4':
      return 'md'
    case 'h5':
      return 'sm'
    default:
      return 'sm'
  }
}

defineOptions({ name: 'CmsParagraph' })
</script>
