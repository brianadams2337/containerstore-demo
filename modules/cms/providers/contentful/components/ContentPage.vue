<template>
  <div v-if="blok?.fields">
    <div class="my-8">
      <SFHeadline size="xl" tag="h1" is-uppercase>
        {{ blok?.fields.headline }}
      </SFHeadline>
      <p class="my-8">
        {{ blok?.fields.subline }}
      </p>
    </div>
    <div v-for="content in blok?.fields.content" :key="content?.sys.id">
      <component
        :is="getComponentName(content?.sys.contentType.sys.id)"
        :blok="content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getComponentName } from '~/modules/cms/utils/helpers'
import type { CMSContentPageProps } from '~/modules/cms/providers/contentful/types'

defineProps<CMSContentPageProps>()
defineOptions({ name: 'CMSContentPage' })
</script>
