<template>
  <div v-editable="blok">
    <div class="my-8">
      <SFHeadline size="xl" tag="h1" is-uppercase>
        {{ blok.headline }}
      </SFHeadline>
      <p class="my-8">{{ blok.subline }}</p>
    </div>
    <div v-for="content in blok.content" :key="content._uid">
      <component
        :is="getComponentName(content.component)"
        :blok="content"
        :important="content.component === 'Paragraph'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CMSContentPageProps } from '~/modules/cms/providers/storyblok/types'
import { getComponentName } from '~/modules/cms/utils/helpers'
defineProps<CMSContentPageProps>()
defineOptions({ name: 'CMSContentPage' })
</script>
