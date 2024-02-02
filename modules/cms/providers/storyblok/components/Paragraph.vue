<template>
  <div v-editable="blok" class="prose mb-10 flex w-full flex-col">
    <Headline size="xs" tag="h3">{{ blok.headline }}</Headline>
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
import type { SbParagraph } from '../types/storyblok'

defineProps({
  blok: {
    type: Object as PropType<SbParagraph>,
    required: true,
  },
})

defineOptions({ name: 'CmsParagraph' })
</script>
