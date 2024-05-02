<template>
  <div class="prose mb-10 flex w-full flex-col">
    <SFHeadline size="xs" tag="h3">
      {{ blok?.fields.headline }}
    </SFHeadline>
    <div v-if="isCtaEmail" class="grid grid-cols-2 justify-items-start gap-8">
      <SFButton type="tertiary" is-full-width>
        {{ blok?.fields.cta }}
      </SFButton>
      <div class="max-w-lg">
        <CMSText v-if="blok?.fields.body" :blok="blok?.fields.body" />
      </div>
    </div>
    <CMSText
      v-else-if="!isCtaEmail && blok?.fields.body"
      :blok="blok?.fields.body"
    />
    <div class="flex flex-row space-x-8">
      <div
        v-for="paragraphImage in blok?.fields.images"
        :key="`store-${paragraphImage?.fields.file?.fileName}`"
        class="flex flex-row space-x-8"
      >
        <CMSContentfulLink
          v-if="paragraphImage?.fields.file"
          :to="paragraphImage.fields.file?.url"
          target="_blank"
        >
          <NuxtPicture
            class="cms-picture picture-contain"
            height="25px"
            provider="contentful"
            :src="paragraphImage.fields.file?.url"
            :alt="
              paragraphImage.fields.title ??
              paragraphImage.fields.file?.fileName
            "
          />
        </CMSContentfulLink>
        <NuxtPicture
          v-else
          class="cms-picture picture-contain"
          height="25px"
          provider="contentful"
          :src="paragraphImage?.fields.file?.url"
          :alt="
            paragraphImage?.fields.title ??
            paragraphImage?.fields.file?.fileName
          "
        />
      </div>
    </div>
    <div class="max-w-lg text-sm text-gray-700">
      {{ blok?.fields.subTitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CMSParagraphProps } from '~/modules/cms/providers/contentful/types'
import CMSText from '~/modules/cms/providers/contentful/components/Text.vue'
const props = defineProps<CMSParagraphProps>()

const isCtaEmail = computed(() => {
  return String(props.blok?.fields.cta ?? '')
    .toLowerCase()
    .match(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    )
})

defineOptions({ name: 'CMSParagraph' })
</script>
